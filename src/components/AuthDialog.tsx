'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface AuthDialogProps {
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export default function AuthDialog({ children, open, onOpenChange }: AuthDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dialogOpen = open !== undefined ? open : isOpen
  const setDialogOpen = onOpenChange || setIsOpen
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [signupData, setSignupData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    contactName: '',
    phone: '',
    address: '',
    accountType: ''
  })
  const { login } = useAuth()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    // Simple demo login - in production, this would validate against a database
    if (loginData.email && loginData.password) {
      const userData = {
        id: Date.now().toString(),
        email: loginData.email,
        companyName: loginData.email.includes('admin') ? 'MBS Supply Co.' : 'Demo Roofing Company',
        contactName: 'Demo User',
        role: loginData.email.includes('admin') ? 'supplier' as const : 'buyer' as const
      }

      login(userData)
      setDialogOpen(false)
      setLoginData({ email: '', password: '' })
    }
  }

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()

    if (signupData.password !== signupData.confirmPassword) {
      alert('Passwords do not match')
      return
    }

    if (signupData.email && signupData.password && signupData.companyName && signupData.contactName && signupData.accountType) {
      const userData = {
        id: Date.now().toString(),
        email: signupData.email,
        companyName: signupData.companyName,
        contactName: signupData.contactName,
        role: signupData.accountType as 'buyer' | 'supplier'
      }

      login(userData)
      setDialogOpen(false)
      setSignupData({
        email: '',
        password: '',
        confirmPassword: '',
        companyName: '',
        contactName: '',
        phone: '',
        address: '',
        accountType: ''
      })
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {children && (
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Access MBS Platform</DialogTitle>
          <DialogDescription>
            <span className="text-green-600 font-medium">🎯 DEMO MODE:</span> Use any email and password to sign in! Try "demo@company.com" or create any account.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Create Account</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email (any email works!)</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="demo@company.com"
                  value={loginData.email}
                  onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Password (any password works!)</Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="demo123"
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  required
                />
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
                <div className="text-blue-800 font-medium mb-1">💡 Demo Quick Access:</div>
                <div className="text-blue-700">
                  • Any email + any password = instant access<br/>
                  • Try: demo@company.com / demo123<br/>
                  • Use "admin" in email for supplier access
                </div>
              </div>
              <Button type="submit" className="w-full mbs-red mbs-red-hover">
                Sign In
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-type">Account Type</Label>
                <Select
                  value={signupData.accountType}
                  onValueChange={(value) => setSignupData({...signupData, accountType: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buyer">Roofing Company (Buyer)</SelectItem>
                    <SelectItem value="supplier">Supplier (MBS Partner)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input
                    id="company-name"
                    placeholder="ABC Roofing Co."
                    value={signupData.companyName}
                    onChange={(e) => setSignupData({...signupData, companyName: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-name">Contact Name</Label>
                  <Input
                    id="contact-name"
                    placeholder="John Smith"
                    value={signupData.contactName}
                    onChange={(e) => setSignupData({...signupData, contactName: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="contact@company.com"
                  value={signupData.email}
                  onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={signupData.phone}
                  onChange={(e) => setSignupData({...signupData, phone: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Business Address</Label>
                <Input
                  id="address"
                  placeholder="123 Main St, City, State 12345"
                  value={signupData.address}
                  onChange={(e) => setSignupData({...signupData, address: e.target.value})}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={signupData.password}
                    onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={signupData.confirmPassword}
                    onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full mbs-red mbs-red-hover">
                Create Account
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
