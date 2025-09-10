import AdminDashboard from '@/components/AdminDashboard'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function Dashboard() {
  return (
    <ProtectedRoute allowedRoles={['supplier']}>
      <AdminDashboard />
    </ProtectedRoute>
  )
}
