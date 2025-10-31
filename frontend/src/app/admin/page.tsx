import { Card } from '../../components/Card'
import { StatusBadge } from '../../components/StatusBadge'

export default function AdminPage() {
  return (
    <section className="grid grid-cols-1 gap-6">
  <h2 className="text-2xl font-semibold text-[color:var(--accent-green)]">Admin Console</h2>

      <div className="grid md:grid-cols-2 gap-4">
        <Card title="Live Device Data">
          <div className="text-[color:var(--text-secondary)]">Table placeholder (devices, metrics)</div>
        </Card>

        <Card title="Alerts & Notifications">
          <div className="text-[color:var(--text-secondary)]">Recent alerts will appear here.</div>
        </Card>
      </div>

      <div className="md:w-1/3">
        <Card title="System Status">
          <div className="flex items-center justify-between">
            <div className="text-[color:var(--text-secondary)]">Overall health</div>
            <StatusBadge status={"OPERATIONAL" as any} />
          </div>
        </Card>
      </div>
    </section>
  )
}
