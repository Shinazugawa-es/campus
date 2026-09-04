import { supabase } from './supabaseClient'
const EMERGENCY_CONTACTS = [
  { label: 'Security', number: '0914648742' },
  { label: 'Dormitory (1)', number: '0969027279' },
  { label: 'Dormitory (2)', number: '0935265714' },
  { label: 'Main Dormitory', number: '0914060944' },
  { label: 'Clinic', number: '0902552255' },
]

const SAFETY_GUIDES = [
  {
    title: 'Medical Emergency',
    steps: [
      'Stay calm and assess if the person is conscious and breathing.',
      'Call or text the Clinic immediately.',
      "If it's serious or the person is unconscious, also alert Security.",
      'Do not move an injured person unless they are in immediate danger.',
      'Stay with them until help arrives if it is safe to do so.',
    ],
  },
  {
    title: 'Fire',
    steps: [
      'Alert everyone nearby immediately.',
      'Leave the building calmly through the nearest exit — do not use elevators.',
      'Do not go back inside for belongings.',
      'Once safely outside, alert Security immediately.',
      'Move to an open area away from the building.',
    ],
  },
  {
    title: 'Feeling Unsafe / Threat',
    steps: [
      'Move to a public, well-lit area with other people if possible.',
      'Contact Security immediately.',
      'If you cannot call, send an SMS — it works even with weak signal.',
      'Trust your instincts — it is always okay to ask for help.',
    ],
  },
]

const EMERGENCY_SMS_NUMBER = '0914648742'
const EMERGENCY_SMS_MESSAGE = 'EMERGENCY: I need help. This is an automated alert from Campus Compass.'

export default function EmergencyPage() {
 async function sendEmergencySMS() {
  const { data: { user } } = await supabase.auth.getUser()
  if (user) await supabase.from('emergency_logs').insert({ user_id: user.id })
  const smsUrl = `sms:${EMERGENCY_SMS_NUMBER}?body=${encodeURIComponent(EMERGENCY_SMS_MESSAGE)}`
  window.location.href = smsUrl
}
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ color: '#c0392b' }}>🚨 Emergency</h2>

      <button
        onClick={sendEmergencySMS}
        style={{
          width: '100%',
          padding: '16px',
          fontSize: '18px',
          fontWeight: 'bold',
          backgroundColor: '#c0392b',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          marginBottom: '20px',
          cursor: 'pointer',
        }}
      >
        🚨 Send Emergency SMS Alert
      </button>

      <section style={{ marginBottom: '20px' }}>
        <h3>Emergency Contacts</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {EMERGENCY_CONTACTS.map((c) => (
            <li
              key={c.label}
              style={{
                border: '1px solid #ddd',
                borderRadius: '6px',
                padding: '10px',
                marginBottom: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span>{c.label}</span>
              <a href={`tel:${c.number}`} style={{ fontWeight: 'bold' }}>
                {c.number}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3>What To Do</h3>
        {SAFETY_GUIDES.map((guide) => (
          <details key={guide.title} style={{ marginBottom: '10px' }}>
            <summary style={{ fontWeight: 'bold', cursor: 'pointer' }}>
              {guide.title}
            </summary>
            <ol>
              {guide.steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </details>
        ))}
      </section>
    </div>
  )
}