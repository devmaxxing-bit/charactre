import { useState, type FormEvent } from 'react'
import './App.css'

type Character = {
  id: number
  name: string
  character_class: string
  level: number
  weapon: string
  description: string
}

type CharacterForm = Omit<Character, 'id'>

const initialForm: CharacterForm = {
  name: '',
  character_class: 'Воин',
  level: 5,
  weapon: 'Меч',
  description: '',
}

function App() {
  const [form, setForm] = useState(initialForm)
  const [character, setCharacter] = useState<Character | null>(null)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function createCharacter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/characters/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const result = await response.json()

      if (!response.ok) {
        const messages = result.errors
          ? Object.values(result.errors).flat().join(' ')
          : result.detail || 'Не удалось создать персонажа.'
        throw new Error(messages)
      }

      setCharacter(result as Character)
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Не удалось связаться с сервером.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  function updateForm(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target
    setForm((current) => ({
      ...current,
      [name]: name === 'level' ? Number(value) : value,
    }))
  }

  function createAnother() {
    setCharacter(null)
    setForm(initialForm)
    setError('')
  }

  return (
    <main className="forge-shell">
      <header className="topbar">
        <a className="wordmark" href="#top" aria-label="Arthas, к началу">
          <span className="wordmark-mark" aria-hidden="true">A</span>
          <span>ARTHAS</span>
        </a>
        <span className="topbar-label">МАСТЕРСКАЯ ГЕРОЕВ</span>
        <span className="edition">МИР · 01</span>
      </header>

      <section className="forge" id="top">
        <div className="form-panel">
          <div className="eyebrow"><span /> НОВАЯ ЛЕТОПИСЬ</div>
          <h1>Создай<br /><em>своего героя.</em></h1>
          <p className="intro">имя и аружие</p>

          <form onSubmit={createCharacter}>
            <label className="field field-wide">
              <span>Имя персонажа</span>
              <input
                autoComplete="off"
                maxLength={100}
                name="name"
                onChange={updateForm}
                placeholder="Например, Аринас"
                required
                value={form.name}
              />
            </label>

            <div className="field-row">
              <label className="field">
                <span>Класс</span>
                <select name="character_class" onChange={updateForm} value={form.character_class}>
                  <option>Воин</option>
                  <option>Маг</option>
                  <option>Лучник</option>
                  <option>Разбойник</option>
                </select>
              </label>
              <label className="field level-field">
                <span>Уровень</span>
                <input
                  max="100"
                  min="1"
                  name="level"
                  onChange={updateForm}
                  required
                  type="number"
                  value={form.level}
                />
              </label>
            </div>

            <label className="field field-wide">
              <span>Оружие</span>
              <select name="weapon" onChange={updateForm} value={form.weapon}>
                <option>Меч</option>
                <option>Посох</option>
                <option>Лук</option>
                <option>Кинжалы</option>
              </select>
            </label>

            <label className="field field-wide">
              <span>Описание <small>НЕОБЯЗАТЕЛЬНО</small></span>
              <textarea
                maxLength={500}
                name="description"
                onChange={updateForm}
                placeholder="Кто он и что привело его в этот мир?"
                rows={3}
                value={form.description}
              />
            </label>

            {error && <p className="form-error" role="alert">{error}</p>}

            <button className="create-button" disabled={isSubmitting} type="submit">
              <span>{isSubmitting ? 'СОЗДАЁМ...' : 'СОЗДАТЬ ПЕРСОНАЖА'}</span>
              <span aria-hidden="true">↗</span>
            </button>
          </form>
          <p className="form-footnote">ТВОЯ ИСТОРИЯ НАЧИНАЕТСЯ С ОДНОГО ИМЕНИ</p>
        </div>

        <aside className={`character-stage${character ? ' is-created' : ''}`} aria-live="polite">
          <img
            className="stage-image"
            src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=85"
            alt="Туманный лес на краю фэнтезийного мира"
          />
          <div className="stage-shade" />
          <div className="stage-topline">
            <span>АРХИВ ПЕРСОНАЖЕЙ</span>
            <span className="archive-index">{character ? '№ 001' : '— / —'}</span>
          </div>

          {character ? (
            <article className="character-card">
              <div className="created-label"><span /> ПЕРСОНАЖ СОЗДАН</div>
              <h2>{character.name}</h2>
              <dl className="character-details">
                <div><dt>Класс</dt><dd>{character.character_class}</dd></div>
                <div><dt>Уровень</dt><dd>{character.level}</dd></div>
                <div><dt>Оружие</dt><dd>{character.weapon}</dd></div>
              </dl>
              {character.description && <p className="character-description">{character.description}</p>}
              <button className="another-button" onClick={createAnother} type="button">
                СОЗДАТЬ ЕЩЁ ОДНОГО <span aria-hidden="true">↗</span>
              </button>
            </article>
          ) : (
            <div className="stage-caption">
              <span className="stage-number">01 — НЕИЗВЕДАННОЕ</span>
              <p>За каждой легендой<br />стоит первый шаг.</p>
            </div>
          )}

          <div className="stage-bottomline">
            <span>СЕВЕРНЫЕ ЗЕМЛИ</span>
            <span>61° 08′ N</span>
          </div>
        </aside>
      </section>

      <footer className="page-footer">
        <span>ARTHAS CHARACTER FORGE</span>
        <span>СОЗДАЙ. ОТПРАВЬСЯ. СТАНЬ ЛЕГЕНДОЙ.</span>
      </footer>
    </main>
  )
}

export default App
