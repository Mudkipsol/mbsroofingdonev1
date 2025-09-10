'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface User {
  id: string
  email: string
  companyName: string
  contactName: string
  role: 'buyer' | 'supplier' | 'admin'
  // Enhanced User Profile
  phone?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  businessType?: 'residential' | 'commercial' | 'industrial'
  yearsInBusiness?: number
  licenseNumber?: string
  insuranceExpiry?: string
  // Account Status & Credit
  accountStatus: 'active' | 'pending' | 'suspended' | 'archived'
  creditLimit?: number
  creditUsed?: number
  creditStatus?: 'approved' | 'pending' | 'denied'
  paymentTerms?: 'net30' | 'net15' | 'cod' | 'credit-card'
  // Loyalty & Preferences
  loyaltyTier: 'bronze' | 'silver' | 'gold' | 'platinum'
  loyaltyPoints: number
  totalSpent: number
  preferredDeliveryType?: 'ground' | 'airdrop' | 'willcall'
  preferredBranch?: string
  // Account Settings
  emailNotifications: boolean
  smsNotifications: boolean
  marketingOptIn: boolean
  autoReorderEnabled: boolean
  // Dates
  joinDate: string
  lastLoginDate?: string
  profileCompleteness: number
}

interface Order {
  id: string
  orderNumber: string
  date: string
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'returned'
  total: number
  items: Array<{
    id: string
    name: string
    quantity: number
    price: number
  }>
  deliveryType: 'ground' | 'airdrop' | 'willcall'
  deliveryAddress?: string
  trackingNumber?: string
  invoiceUrl?: string
}

interface CreditApplication {
  id: string
  businessName: string
  requestedLimit: number
  status: 'pending' | 'approved' | 'denied' | 'under-review'
  submitDate: string
  reviewDate?: string
  documents: Array<{
    type: 'tax-id' | 'financial-statement' | 'bank-reference' | 'trade-reference'
    url: string
    status: 'uploaded' | 'verified' | 'rejected'
  }>
}

interface LoyaltyReward {
  id: string
  title: string
  description: string
  pointsCost: number
  type: 'discount' | 'free-shipping' | 'product' | 'service'
  value: number
  expiryDate?: string
  isRedeemed: boolean
  redeemedDate?: string
}

interface AuthContextType {
  user: User | null
  orders: Order[]
  creditApplications: CreditApplication[]
  availableRewards: LoyaltyReward[]
  redeemedRewards: LoyaltyReward[]
  login: (userData: Partial<User>) => void
  logout: () => void
  updateProfile: (updates: Partial<User>) => void
  submitCreditApplication: (application: Omit<CreditApplication, 'id' | 'status' | 'submitDate'>) => void
  redeemReward: (rewardId: string) => void
  addOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'date'>) => void
  getAccountInsights: () => {
    totalOrders: number
    avgOrderValue: number
    monthlySpending: number
    loyaltyProgress: number
    nextTierSpending: number
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [creditApplications, setCreditApplications] = useState<CreditApplication[]>([])
  const [availableRewards, setAvailableRewards] = useState<LoyaltyReward[]>([])
  const [redeemedRewards, setRedeemedRewards] = useState<LoyaltyReward[]>([])

  // Load data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('mbs-user')
    const savedOrders = localStorage.getItem('mbs-user-orders')
    const savedCreditApps = localStorage.getItem('mbs-credit-applications')
    const savedRewards = localStorage.getItem('mbs-redeemed-rewards')

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Error loading user:', error)
      }
    }

    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders))
      } catch (error) {
        console.error('Error loading orders:', error)
      }
    }

    if (savedCreditApps) {
      try {
        setCreditApplications(JSON.parse(savedCreditApps))
      } catch (error) {
        console.error('Error loading credit applications:', error)
      }
    }

    if (savedRewards) {
      try {
        setRedeemedRewards(JSON.parse(savedRewards))
      } catch (error) {
        console.error('Error loading rewards:', error)
      }
    }

    // Initialize sample rewards
    setAvailableRewards([
      {
        id: 'reward-1',
        title: '5% Off Next Order',
        description: 'Get 5% off your next purchase of $500 or more',
        pointsCost: 1000,
        type: 'discount',
        value: 5,
        isRedeemed: false
      },
      {
        id: 'reward-2',
        title: 'Free Ground Delivery',
        description: 'Free standard delivery on any order',
        pointsCost: 750,
        type: 'free-shipping',
        value: 75,
        isRedeemed: false
      },
      {
        id: 'reward-3',
        title: 'Premium Tool Set',
        description: 'Professional roofing tool set valued at $200',
        pointsCost: 5000,
        type: 'product',
        value: 200,
        isRedeemed: false
      },
      {
        id: 'reward-4',
        title: '10% Off Bulk Order',
        description: 'Get 10% off orders over $2000',
        pointsCost: 2500,
        type: 'discount',
        value: 10,
        expiryDate: '2024-12-31',
        isRedeemed: false
      }
    ])
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('mbs-user', JSON.stringify(user))
    } else {
      localStorage.removeItem('mbs-user')
    }
  }, [user])

  useEffect(() => {
    localStorage.setItem('mbs-user-orders', JSON.stringify(orders))
  }, [orders])

  useEffect(() => {
    localStorage.setItem('mbs-credit-applications', JSON.stringify(creditApplications))
  }, [creditApplications])

  useEffect(() => {
    localStorage.setItem('mbs-redeemed-rewards', JSON.stringify(redeemedRewards))
  }, [redeemedRewards])

  const calculateLoyaltyTier = (totalSpent: number): User['loyaltyTier'] => {
    if (totalSpent >= 50000) return 'platinum'
    if (totalSpent >= 25000) return 'gold'
    if (totalSpent >= 10000) return 'silver'
    return 'bronze'
  }

  const calculateLoyaltyPoints = (orderTotal: number): number => {
    // 1 point per dollar spent, bonus for higher tiers
    const basePoints = Math.floor(orderTotal)
    const user = JSON.parse(localStorage.getItem('mbs-user') || '{}')
    const multiplier = user.loyaltyTier === 'platinum' ? 2 :
                     user.loyaltyTier === 'gold' ? 1.5 :
                     user.loyaltyTier === 'silver' ? 1.25 : 1
    return Math.floor(basePoints * multiplier)
  }

  const calculateProfileCompleteness = (userData: Partial<User>): number => {
    const fields = [
      'email', 'companyName', 'contactName', 'phone', 'address',
      'city', 'state', 'zipCode', 'businessType', 'licenseNumber'
    ]
    const completed = fields.filter(field => userData[field as keyof User]).length
    return Math.round((completed / fields.length) * 100)
  }

  const login = (userData: Partial<User>) => {
    const newUser: User = {
      id: userData.id || Date.now().toString(),
      email: userData.email || '',
      companyName: userData.companyName || '',
      contactName: userData.contactName || '',
      role: userData.role || 'buyer',
      phone: userData.phone,
      address: userData.address,
      city: userData.city,
      state: userData.state,
      zipCode: userData.zipCode,
      businessType: userData.businessType,
      yearsInBusiness: userData.yearsInBusiness,
      licenseNumber: userData.licenseNumber,
      insuranceExpiry: userData.insuranceExpiry,
      accountStatus: userData.accountStatus || 'active',
      creditLimit: userData.creditLimit || 0,
      creditUsed: userData.creditUsed || 0,
      creditStatus: userData.creditStatus,
      paymentTerms: userData.paymentTerms || 'credit-card',
      loyaltyTier: userData.loyaltyTier || 'bronze',
      loyaltyPoints: userData.loyaltyPoints || 0,
      totalSpent: userData.totalSpent || 0,
      preferredDeliveryType: userData.preferredDeliveryType,
      preferredBranch: userData.preferredBranch,
      emailNotifications: userData.emailNotifications ?? true,
      smsNotifications: userData.smsNotifications ?? false,
      marketingOptIn: userData.marketingOptIn ?? true,
      autoReorderEnabled: userData.autoReorderEnabled ?? false,
      joinDate: userData.joinDate || new Date().toISOString(),
      lastLoginDate: new Date().toISOString(),
      profileCompleteness: 0
    }

    newUser.profileCompleteness = calculateProfileCompleteness(newUser)
    newUser.loyaltyTier = calculateLoyaltyTier(newUser.totalSpent)

    setUser(newUser)
  }

  const logout = () => {
    setUser(null)
    setOrders([])
    setCreditApplications([])
    setRedeemedRewards([])
    localStorage.removeItem('mbs-user')
    localStorage.removeItem('mbs-user-orders')
    localStorage.removeItem('mbs-credit-applications')
    localStorage.removeItem('mbs-redeemed-rewards')
  }

  const updateProfile = (updates: Partial<User>) => {
    if (!user) return

    const updatedUser = {
      ...user,
      ...updates,
      lastLoginDate: new Date().toISOString()
    }
    updatedUser.profileCompleteness = calculateProfileCompleteness(updatedUser)
    updatedUser.loyaltyTier = calculateLoyaltyTier(updatedUser.totalSpent)

    setUser(updatedUser)
  }

  const submitCreditApplication = (application: Omit<CreditApplication, 'id' | 'status' | 'submitDate'>) => {
    const newApplication: CreditApplication = {
      ...application,
      id: `CA-${Date.now()}`,
      status: 'pending',
      submitDate: new Date().toISOString()
    }
    setCreditApplications(prev => [...prev, newApplication])
  }

  const redeemReward = (rewardId: string) => {
    const reward = availableRewards.find(r => r.id === rewardId)
    if (!reward || !user) return

    if (user.loyaltyPoints >= reward.pointsCost) {
      // Deduct points
      updateProfile({
        loyaltyPoints: user.loyaltyPoints - reward.pointsCost
      })

      // Move to redeemed rewards
      const redeemedReward = {
        ...reward,
        isRedeemed: true,
        redeemedDate: new Date().toISOString()
      }
      setRedeemedRewards(prev => [...prev, redeemedReward])
    }
  }

  const addOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'date'>) => {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Date.now()}`,
      orderNumber: `MBS-${Date.now()}`,
      date: new Date().toISOString()
    }

    setOrders(prev => [...prev, newOrder])

    // Update user spending and loyalty points
    if (user && newOrder.status !== 'cancelled') {
      const newTotalSpent = user.totalSpent + newOrder.total
      const earnedPoints = calculateLoyaltyPoints(newOrder.total)

      updateProfile({
        totalSpent: newTotalSpent,
        loyaltyPoints: user.loyaltyPoints + earnedPoints,
        loyaltyTier: calculateLoyaltyTier(newTotalSpent)
      })
    }
  }

  const getAccountInsights = () => {
    const totalOrders = orders.length
    const completedOrders = orders.filter(o => o.status === 'delivered')
    const avgOrderValue = completedOrders.length > 0
      ? completedOrders.reduce((sum, o) => sum + o.total, 0) / completedOrders.length
      : 0

    // Calculate monthly spending (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const monthlySpending = orders
      .filter(o => new Date(o.date) >= thirtyDaysAgo && o.status === 'delivered')
      .reduce((sum, o) => sum + o.total, 0)

    // Loyalty tier progress
    const tierThresholds = { bronze: 0, silver: 10000, gold: 25000, platinum: 50000 }
    const currentTierSpent = user?.totalSpent || 0
    const currentTier = user?.loyaltyTier || 'bronze'
    const nextTier = currentTier === 'bronze' ? 'silver' :
                    currentTier === 'silver' ? 'gold' :
                    currentTier === 'gold' ? 'platinum' : null

    const nextTierThreshold = nextTier ? tierThresholds[nextTier] : tierThresholds.platinum
    const loyaltyProgress = nextTier
      ? (currentTierSpent / nextTierThreshold) * 100
      : 100
    const nextTierSpending = nextTier ? nextTierThreshold - currentTierSpent : 0

    return {
      totalOrders,
      avgOrderValue,
      monthlySpending,
      loyaltyProgress,
      nextTierSpending
    }
  }

  const value: AuthContextType = {
    user,
    orders,
    creditApplications,
    availableRewards,
    redeemedRewards,
    login,
    logout,
    updateProfile,
    submitCreditApplication,
    redeemReward,
    addOrder,
    getAccountInsights
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
