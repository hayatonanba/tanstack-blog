import type { FormEvent } from 'react'
import { useState } from 'react'
import { useCreatePost } from '../hooks/post'
import { css } from '../../styled-system/css'

export default function PostNew() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const create = useCreatePost()

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    create.mutate({ title, content })
    setTitle('')
    setContent('')
  }

  return (
    <form
      onSubmit={onSubmit}
      className={css({
        p: 6,
        maxW: '800px',
        mx: 'auto',
        display: 'flex',
        flexDir: 'column',
        gap: 3,
      })}
    >
      <h1 className={css({ fontSize: '2xl', fontWeight: 'bold' })}>New Post</h1>

      <input
        className={css({
          borderWidth: '1px',
          w: 'full',
          p: 2,
        })}
        placeholder="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className={css({
          borderWidth: '1px',
          w: 'full',
          p: 2,
          h: 40,
        })}
        placeholder="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button
        type="submit"
        disabled={create.isPending}
        className={css({
          borderWidth: '1px',
          px: 4,
          py: 2,
          rounded: 'md',
          _disabled: { opacity: 0.6, cursor: 'not-allowed' },
        })}
      >
        {create.isPending ? 'Saving…' : 'Save'}
      </button>
    </form>
  )
}
