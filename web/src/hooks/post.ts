import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../api/client'

export type Post = {
  id: number;
  title: string;
  content: string;
  createdAt: string | number;
  updatedAt: string | number;
}

const keys = {
  all: ['posts'] as const,
  detail: (id: number) => [...keys.all, 'detail', id] as const,
}

export function usePosts() {
  return useQuery({
    queryKey: keys.all,
    queryFn: async () => {
      const res = await api.get<Post[]>('/posts')
      return res.data
    },
    staleTime: 1000 * 10, // 10秒は新鮮扱い
  })
}

// 詳細
export function usePost(id: number) {
  return useQuery({
    queryKey: keys.detail(id),
    queryFn: async () => (await api.get<Post>(`/posts/${id}`)).data,
  })
}

// 作成（楽観更新）
export function useCreatePost() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: Pick<Post, 'title' | 'content'>) =>
      (await api.post<Post>('/posts', input)).data,
    onMutate: async (newPost) => {
      await qc.cancelQueries({ queryKey: keys.all })
      const prev = qc.getQueryData<Post[]>(keys.all) ?? []
      const optimistic: Post = {
        id: 5,
        title: newPost.title,
        content: newPost.content,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
      qc.setQueryData<Post[]>(keys.all, [optimistic, ...prev])
      return { prev }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(keys.all, ctx.prev)
    },
    onSuccess: (created) => {
      // 楽観レコードと差し替え
      qc.setQueryData<Post[]>(keys.all, (old = []) =>
        [created, ...old.filter((p) => p.id > 0)],
      )
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: keys.all })
    },
  })
}

// 更新
export function useUpdatePost(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: Partial<Pick<Post, 'title' | 'content'>>) =>
      (await api.patch<Post>(`/posts/${id}`, input)).data,
    onSuccess: (updated) => {
      qc.setQueryData(keys.detail(id), updated)
      qc.invalidateQueries({ queryKey: keys.all })
    },
  })
}

// 削除
export function useDeletePost(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      await api.delete(`/posts/${id}`)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.all })
    },
  })
}