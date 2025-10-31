import Link from 'next/link'

export default function Home() {
  return (
    <section className="container mx-auto">
      <div className="grid grid-cols-1 gap-8">
        <div className="military-panel p-8">
          <h1 className="text-3xl font-bold text-[color:var(--accent-green)]">
            Naakshatra: Intelligent Life-Saving Detection System
          </h1>
          <p className="mt-3 text-[color:var(--text-secondary)] max-w-2xl">
            Minimal, performant dashboard starter for rapid hackathon development.
          </p>
          <div className="mt-6">
            <Link href="/admin" className="btn btn-primary">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
