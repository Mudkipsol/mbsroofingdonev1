'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import {
  User,
  CreditCard,
  Package,
  Star,
  Gift,
  Settings,
  TrendingUp,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Building,
  FileText,
  Download,
  Upload,
  Edit2,
  Save,
  CheckCircle,
  Clock,
  XCircle,
  Award,
  DollarSign,
  Truck,
  ShoppingCart,
  Bell,
  Smartphone,
  RotateCcw,
  Eye,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

import type { User as UserType } from '@/context/AuthContext';

export default function AccountPage() {
  const router = useRouter();
  const {
    user,
    orders,
    creditApplications,
    availableRewards,
    redeemedRewards,
    updateProfile,
    submitCreditApplication,
    redeemReward,
    getAccountInsights,
    logout
  } = useAuth();

  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<UserType>>(user || {});
  const [creditAppOpen, setCreditAppOpen] = useState(false);
  const [rewardDialogOpen, setRewardDialogOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState<any>(null);

  // Credit Application Form State
  const [creditForm, setCreditForm] = useState({
    businessName: user?.companyName || '',
    requestedLimit: 10000,
    documents: []
  });

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }
    setEditedProfile(user);
  }, [user, router]);

  if (!user) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Card className="max-w-md w-full">
            <CardContent className="p-8 text-center">
              <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Account Required</h2>
              <p className="text-gray-600 mb-6">Please sign in to access your account</p>
              <Button onClick={() => router.push('/')} className="w-full">
                Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </>
    );
  }

  const insights = getAccountInsights();

  const handleProfileSave = () => {
    updateProfile(editedProfile);
    setEditMode(false);
  };

  const handleCreditApplicationSubmit = () => {
    submitCreditApplication(creditForm);
    setCreditAppOpen(false);
    setCreditForm({
      businessName: user?.companyName || '',
      requestedLimit: 10000,
      documents: []
    });
  };

  const handleRewardRedeem = () => {
    if (selectedReward) {
      redeemReward(selectedReward.id);
      setRewardDialogOpen(false);
      setSelectedReward(null);
    }
  };

  const getLoyaltyTierColor = (tier: string) => {
    switch (tier) {
      case 'platinum': return 'bg-purple-500';
      case 'gold': return 'bg-yellow-500';
      case 'silver': return 'bg-gray-400';
      default: return 'bg-orange-600';
    }
  };

  const getLoyaltyTierBenefits = (tier: string) => {
    switch (tier) {
      case 'platinum':
        return ['2x loyalty points', 'Free express shipping', 'Priority support', 'Exclusive products', '15% bulk discount'];
      case 'gold':
        return ['1.5x loyalty points', 'Free standard shipping', 'Priority support', '10% bulk discount'];
      case 'silver':
        return ['1.25x loyalty points', 'Free shipping over $500', '5% bulk discount'];
      default:
        return ['1x loyalty points', 'Standard shipping rates', 'Email support'];
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
      case 'completed':
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
      case 'processing':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'cancelled':
      case 'denied':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Account Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-red-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{user.contactName}</h1>
                  <p className="text-gray-600">{user.companyName}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={`${getLoyaltyTierColor(user.loyaltyTier)} text-white capitalize`}>
                      {user.loyaltyTier} Member
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {user.loyaltyPoints.toLocaleString()} points
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Account Status</div>
                <Badge className={user.accountStatus === 'active' ? 'bg-green-500' : 'bg-yellow-500'}>
                  {user.accountStatus}
                </Badge>
                <div className="text-xs text-gray-400 mt-1">
                  Member since {new Date(user.joinDate).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{insights.totalOrders}</div>
                <div className="text-sm text-gray-500">Total Orders</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">${insights.avgOrderValue.toFixed(0)}</div>
                <div className="text-sm text-gray-500">Avg Order Value</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">${insights.monthlySpending.toFixed(0)}</div>
                <div className="text-sm text-gray-500">This Month</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{Math.round(insights.loyaltyProgress)}%</div>
                <div className="text-sm text-gray-500">To Next Tier</div>
              </div>
            </div>
          </div>

          {/* Account Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                <span className="hidden sm:inline">Orders</span>
              </TabsTrigger>
              <TabsTrigger value="loyalty" className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                <span className="hidden sm:inline">Rewards</span>
              </TabsTrigger>
              <TabsTrigger value="credit" className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                <span className="hidden sm:inline">Credit</span>
              </TabsTrigger>
              <TabsTrigger value="insights" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span className="hidden sm:inline">Insights</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Profile Information</CardTitle>
                      <CardDescription>Manage your personal and business information</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-gray-500">
                        {user.profileCompleteness}% complete
                      </div>
                      <Progress value={user.profileCompleteness} className="w-20" />
                      <Button
                        variant={editMode ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => editMode ? handleProfileSave() : setEditMode(true)}
                      >
                        {editMode ? <Save className="w-4 h-4 mr-2" /> : <Edit2 className="w-4 h-4 mr-2" />}
                        {editMode ? 'Save' : 'Edit'}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Basic Information */}
                  <div>
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Contact Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="contactName">Contact Name</Label>
                        <Input
                          id="contactName"
                          value={editMode ? editedProfile.contactName : user.contactName}
                          onChange={(e) => setEditedProfile({...editedProfile, contactName: e.target.value})}
                          disabled={!editMode}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          value={editMode ? editedProfile.email : user.email}
                          onChange={(e) => setEditedProfile({...editedProfile, email: e.target.value})}
                          disabled={!editMode}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={editMode ? editedProfile.phone || '' : user.phone || ''}
                          onChange={(e) => setEditedProfile({...editedProfile, phone: e.target.value})}
                          disabled={!editMode}
                          placeholder="(555) 123-4567"
                        />
                      </div>
                      <div>
                        <Label htmlFor="licenseNumber">License Number</Label>
                        <Input
                          id="licenseNumber"
                          value={editMode ? editedProfile.licenseNumber || '' : user.licenseNumber || ''}
                          onChange={(e) => setEditedProfile({...editedProfile, licenseNumber: e.target.value})}
                          disabled={!editMode}
                          placeholder="Contractor license number"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Business Information */}
                  <div>
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      Business Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="companyName">Company Name</Label>
                        <Input
                          id="companyName"
                          value={editMode ? editedProfile.companyName : user.companyName}
                          onChange={(e) => setEditedProfile({...editedProfile, companyName: e.target.value})}
                          disabled={!editMode}
                        />
                      </div>
                      <div>
                        <Label htmlFor="businessType">Business Type</Label>
                        <Select
                          value={editMode ? editedProfile.businessType : user.businessType}
                          onValueChange={(value) => setEditedProfile({...editedProfile, businessType: value as UserType['businessType']})}
                          disabled={!editMode}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select business type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="residential">Residential Roofing</SelectItem>
                            <SelectItem value="commercial">Commercial Roofing</SelectItem>
                            <SelectItem value="industrial">Industrial Roofing</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="yearsInBusiness">Years in Business</Label>
                        <Input
                          id="yearsInBusiness"
                          type="number"
                          value={editMode ? editedProfile.yearsInBusiness || '' : user.yearsInBusiness || ''}
                          onChange={(e) => setEditedProfile({...editedProfile, yearsInBusiness: parseInt(e.target.value)})}
                          disabled={!editMode}
                        />
                      </div>
                      <div>
                        <Label htmlFor="insuranceExpiry">Insurance Expiry</Label>
                        <Input
                          id="insuranceExpiry"
                          type="date"
                          value={editMode ? editedProfile.insuranceExpiry || '' : user.insuranceExpiry || ''}
                          onChange={(e) => setEditedProfile({...editedProfile, insuranceExpiry: e.target.value})}
                          disabled={!editMode}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Address Information */}
                  <div>
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Business Address
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <Label htmlFor="address">Street Address</Label>
                        <Input
                          id="address"
                          value={editMode ? editedProfile.address || '' : user.address || ''}
                          onChange={(e) => setEditedProfile({...editedProfile, address: e.target.value})}
                          disabled={!editMode}
                        />
                      </div>
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={editMode ? editedProfile.city || '' : user.city || ''}
                          onChange={(e) => setEditedProfile({...editedProfile, city: e.target.value})}
                          disabled={!editMode}
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Select
                          value={editMode ? editedProfile.state : user.state}
                          onValueChange={(value) => setEditedProfile({...editedProfile, state: value})}
                          disabled={!editMode}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="OH">Ohio</SelectItem>
                            <SelectItem value="PA">Pennsylvania</SelectItem>
                            <SelectItem value="WV">West Virginia</SelectItem>
                            <SelectItem value="KY">Kentucky</SelectItem>
                            <SelectItem value="IN">Indiana</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input
                          id="zipCode"
                          value={editMode ? editedProfile.zipCode || '' : user.zipCode || ''}
                          onChange={(e) => setEditedProfile({...editedProfile, zipCode: e.target.value})}
                          disabled={!editMode}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                  <CardDescription>View and track all your orders</CardDescription>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Orders Yet</h3>
                      <p className="text-gray-600 mb-4">Start shopping to see your orders here</p>
                      <Button asChild>
                        <Link href="/inventory">Browse Products</Link>
                      </Button>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order #</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Delivery</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">{order.orderNumber}</TableCell>
                            <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {getStatusIcon(order.status)}
                                <span className="capitalize">{order.status}</span>
                              </div>
                            </TableCell>
                            <TableCell className="font-semibold">${order.total.toFixed(2)}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="capitalize">
                                {order.deliveryType}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button size="sm" variant="outline">
                                  <Eye className="w-3 h-3" />
                                </Button>
                                {order.invoiceUrl && (
                                  <Button size="sm" variant="outline">
                                    <Download className="w-3 h-3" />
                                  </Button>
                                )}
                                {order.status === 'delivered' && (
                                  <Button size="sm" variant="outline">
                                    <RotateCcw className="w-3 h-3" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Loyalty Tab */}
            <TabsContent value="loyalty" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Loyalty Rewards Program</CardTitle>
                  <CardDescription>Earn points and unlock exclusive benefits</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Loyalty Status */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Current Tier</span>
                          <Badge className={`${getLoyaltyTierColor(user.loyaltyTier)} text-white capitalize`}>
                            {user.loyaltyTier}
                          </Badge>
                        </div>
                        <Progress value={insights.loyaltyProgress} className="h-3" />
                        <div className="text-xs text-gray-600 mt-1">
                          {insights.nextTierSpending > 0
                            ? `$${insights.nextTierSpending.toLocaleString()} to next tier`
                            : 'Maximum tier reached!'
                          }
                        </div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">{user.loyaltyPoints.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">Available Points</div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">{user.loyaltyTier.charAt(0).toUpperCase() + user.loyaltyTier.slice(1)} Benefits</h4>
                      <ul className="space-y-2">
                        {getLoyaltyTierBenefits(user.loyaltyTier).map((benefit, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  {/* Available Rewards */}
                  <div>
                    <h4 className="font-semibold mb-4">Available Rewards</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {availableRewards.map((reward) => (
                        <Card key={reward.id} className="border border-gray-200">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="font-medium">{reward.title}</h5>
                              <Badge variant="outline">{reward.pointsCost} pts</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{reward.description}</p>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-green-600 font-medium">
                                Value: ${reward.value}
                              </span>
                              <Button
                                size="sm"
                                disabled={user.loyaltyPoints < reward.pointsCost}
                                onClick={() => {
                                  setSelectedReward(reward);
                                  setRewardDialogOpen(true);
                                }}
                              >
                                <Gift className="w-3 h-3 mr-1" />
                                Redeem
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Redeemed Rewards */}
                  {redeemedRewards.length > 0 && (
                    <>
                      <Separator className="my-6" />
                      <div>
                        <h4 className="font-semibold mb-4">Redeemed Rewards</h4>
                        <div className="space-y-2">
                          {redeemedRewards.map((reward) => (
                            <div key={reward.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                              <div>
                                <div className="font-medium">{reward.title}</div>
                                <div className="text-sm text-gray-600">
                                  Redeemed on {new Date(reward.redeemedDate!).toLocaleDateString()}
                                </div>
                              </div>
                              <Badge className="bg-green-500 text-white">Redeemed</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Credit Tab */}
            <TabsContent value="credit" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Credit Management</CardTitle>
                  <CardDescription>Manage your business credit and payment terms</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Current Credit Status */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        ${user.creditLimit?.toLocaleString() || '0'}
                      </div>
                      <div className="text-sm text-gray-600">Credit Limit</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">
                        ${user.creditUsed?.toLocaleString() || '0'}
                      </div>
                      <div className="text-sm text-gray-600">Credit Used</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        ${((user.creditLimit || 0) - (user.creditUsed || 0)).toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Available Credit</div>
                    </div>
                  </div>

                  {/* Credit Applications */}
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold">Credit Applications</h4>
                    <Dialog open={creditAppOpen} onOpenChange={setCreditAppOpen}>
                      <DialogTrigger asChild>
                        <Button>
                          <FileText className="w-4 h-4 mr-2" />
                          Apply for Credit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Credit Application</DialogTitle>
                          <DialogDescription>
                            Apply for business credit terms with MBS
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="businessName">Business Name</Label>
                              <Input
                                id="businessName"
                                value={creditForm.businessName}
                                onChange={(e) => setCreditForm({...creditForm, businessName: e.target.value})}
                              />
                            </div>
                            <div>
                              <Label htmlFor="requestedLimit">Requested Credit Limit</Label>
                              <Select
                                value={creditForm.requestedLimit.toString()}
                                onValueChange={(value) => setCreditForm({...creditForm, requestedLimit: parseInt(value)})}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="5000">$5,000</SelectItem>
                                  <SelectItem value="10000">$10,000</SelectItem>
                                  <SelectItem value="25000">$25,000</SelectItem>
                                  <SelectItem value="50000">$50,000</SelectItem>
                                  <SelectItem value="100000">$100,000</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div>
                            <Label>Required Documents</Label>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              <Button variant="outline" size="sm">
                                <Upload className="w-3 h-3 mr-1" />
                                Tax ID
                              </Button>
                              <Button variant="outline" size="sm">
                                <Upload className="w-3 h-3 mr-1" />
                                Financial Statement
                              </Button>
                              <Button variant="outline" size="sm">
                                <Upload className="w-3 h-3 mr-1" />
                                Bank Reference
                              </Button>
                              <Button variant="outline" size="sm">
                                <Upload className="w-3 h-3 mr-1" />
                                Trade Reference
                              </Button>
                            </div>
                          </div>
                          <div className="flex justify-end gap-2 pt-4">
                            <Button variant="outline" onClick={() => setCreditAppOpen(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleCreditApplicationSubmit}>
                              Submit Application
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {creditApplications.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p>No credit applications submitted</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {creditApplications.map((app) => (
                        <div key={app.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium">{app.businessName}</div>
                              <div className="text-sm text-gray-600">
                                Requested: ${app.requestedLimit.toLocaleString()}
                              </div>
                              <div className="text-xs text-gray-500">
                                Submitted: {new Date(app.submitDate).toLocaleDateString()}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(app.status)}
                              <Badge className={
                                app.status === 'approved' ? 'bg-green-500' :
                                app.status === 'denied' ? 'bg-red-500' :
                                'bg-yellow-500'
                              }>
                                {app.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Insights Tab */}
            <TabsContent value="insights" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Spending Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Total Lifetime Spending</span>
                        <span className="font-bold text-green-600">
                          ${user.totalSpent.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Average Order Value</span>
                        <span className="font-bold">
                          ${insights.avgOrderValue.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Monthly Spending</span>
                        <span className="font-bold text-blue-600">
                          ${insights.monthlySpending.toFixed(2)}
                        </span>
                      </div>
                      <Separator />
                      <div className="text-sm text-gray-600">
                        <p>💡 <strong>Tip:</strong> Reach ${(user.loyaltyTier === 'bronze' ? 10000 :
                           user.loyaltyTier === 'silver' ? 25000 : 50000).toLocaleString()} in total spending to unlock the next loyalty tier!</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      Account Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm">Profile Completeness</span>
                          <span className="text-sm font-medium">{user.profileCompleteness}%</span>
                        </div>
                        <Progress value={user.profileCompleteness} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm">Loyalty Progress</span>
                          <span className="text-sm font-medium">{Math.round(insights.loyaltyProgress)}%</span>
                        </div>
                        <Progress value={insights.loyaltyProgress} className="h-2" />
                      </div>
                      <Separator />
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="text-lg font-bold">{orders.filter(o => o.status === 'delivered').length}</div>
                          <div className="text-xs text-gray-500">Completed Orders</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold">{user.loyaltyPoints.toLocaleString()}</div>
                          <div className="text-xs text-gray-500">Loyalty Points</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your preferences and notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Notifications */}
                  <div>
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <Bell className="w-4 h-4" />
                      Notification Preferences
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Email Notifications</div>
                          <div className="text-sm text-gray-600">Order updates, promotions, and news</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={user.emailNotifications}
                          onChange={(e) => updateProfile({ emailNotifications: e.target.checked })}
                          className="rounded"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">SMS Notifications</div>
                          <div className="text-sm text-gray-600">Order status and delivery updates</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={user.smsNotifications}
                          onChange={(e) => updateProfile({ smsNotifications: e.target.checked })}
                          className="rounded"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Marketing Communications</div>
                          <div className="text-sm text-gray-600">Special offers and product updates</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={user.marketingOptIn}
                          onChange={(e) => updateProfile({ marketingOptIn: e.target.checked })}
                          className="rounded"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Delivery Preferences */}
                  <div>
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <Truck className="w-4 h-4" />
                      Delivery Preferences
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="preferredDeliveryType">Preferred Delivery Type</Label>
                        <Select
                          value={user.preferredDeliveryType || ''}
                          onValueChange={(value) => updateProfile({ preferredDeliveryType: value as any })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select delivery type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ground">Ground Drop ($75)</SelectItem>
                            <SelectItem value="airdrop">Airdrop ($150)</SelectItem>
                            <SelectItem value="willcall">Will Call (Free)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="preferredBranch">Preferred Branch</Label>
                        <Select
                          value={user.preferredBranch || ''}
                          onValueChange={(value) => updateProfile({ preferredBranch: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select branch" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="youngstown">Youngstown, OH</SelectItem>
                            <SelectItem value="akron">Akron, OH</SelectItem>
                            <SelectItem value="columbus">Columbus, OH</SelectItem>
                            <SelectItem value="cleveland">Cleveland, OH</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Auto Reorder */}
                  <div>
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <RotateCcw className="w-4 h-4" />
                      Auto Reorder Settings
                    </h4>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Enable Auto Reorder</div>
                        <div className="text-sm text-gray-600">Automatically reorder frequently purchased items</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={user.autoReorderEnabled}
                        onChange={(e) => updateProfile({ autoReorderEnabled: e.target.checked })}
                        className="rounded"
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Account Actions */}
                  <div>
                    <h4 className="font-semibold mb-4">Account Actions</h4>
                    <div className="flex gap-3">
                      <Button variant="outline" onClick={logout}>
                        Sign Out
                      </Button>
                      <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Deactivate Account
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Reward Redemption Dialog */}
      <Dialog open={rewardDialogOpen} onOpenChange={setRewardDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Redeem Reward</DialogTitle>
            <DialogDescription>
              Are you sure you want to redeem this reward?
            </DialogDescription>
          </DialogHeader>
          {selectedReward && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-semibold">{selectedReward.title}</div>
                <div className="text-sm text-gray-600">{selectedReward.description}</div>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-sm">Cost: {selectedReward.pointsCost} points</span>
                  <span className="text-sm text-green-600">Value: ${selectedReward.value}</span>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                Your current balance: {user.loyaltyPoints.toLocaleString()} points<br />
                After redemption: {(user.loyaltyPoints - selectedReward.pointsCost).toLocaleString()} points
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setRewardDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleRewardRedeem}>
                  <Gift className="w-4 h-4 mr-2" />
                  Redeem Reward
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </>
  );
}
