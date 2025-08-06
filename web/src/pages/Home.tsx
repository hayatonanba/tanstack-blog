import { usePosts, useDeletePost } from '../hooks/post'
import { css } from '../../styled-system/css'

export default function Home() {
  const { data, isLoading, isError } = usePosts()

  if (isLoading) return <p>Loading...</p>
  if (isError) return <p>Failed to load</p>

  return (
    <div
      className={css({
        p: 6,
        maxW: '800px',
        mx: 'auto',
        display: 'flex',
        flexDir: 'column',
        gap: 4,
      })}
    >
      <h1 className={css({ fontSize: '2xl', fontWeight: 'bold' })}>Posts</h1>
      {data?.map((p) => (
        <PostItem key={p.id} {...p} />
      ))}
    </div>
  )
}

function PostItem({
  id,
  title,
  content,
}: {
   id: number;
  title: string;
  content: string;
}) {
  const del = useDeletePost(id)

  return (
    <article
      className={css({
        borderWidth: '1px',
        rounded: 'md',
        p: 4,
        display: 'flex',
        flexDir: 'column',
        gap: 2,
      })}
    >
      <h2 className={css({ fontSize: 'xl', fontWeight: 'semibold' })}>
        {title}
      </h2>
      <p className={css({ whiteSpace: 'pre-wrap' })}>{content}</p>
      <button
        onClick={() => del.mutate()}
        className={css({
          borderWidth: '1px',
          rounded: 'sm',
          px: 3,
          py: 1,
          alignSelf: 'flex-start',
        })}
      >
        Delete
      </button>
    </article>
  )
}
