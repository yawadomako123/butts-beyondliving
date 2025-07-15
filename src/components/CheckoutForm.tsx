import { useState } from "react";
import { MapPin, CreditCard, Package, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CartItem } from "./Cart";

interface CheckoutFormProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  items: CartItem[];
  onPlaceOrder: (orderData: OrderData) => void;
}

export interface OrderData {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  deliveryNotes?: string;
  paymentMethod: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
}

export const CheckoutForm = ({
  isOpen,
  onClose,
  onBack,
  items,
  onPlaceOrder,
}: CheckoutFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<OrderData>>({
    paymentMethod: 'card'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = total > 100 ? 0 : 9.99;
  const tax = total * 0.08;
  const finalTotal = total + shipping + tax;

  const handleInputChange = (field: keyof OrderData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate order processing
    onPlaceOrder(formData as OrderData);
    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="fixed inset-0 overflow-y-auto">
        <div className="min-h-full flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl bg-background shadow-2xl animate-scale-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 border-b">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={onBack}>
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <CardTitle className="text-2xl font-bold">Checkout</CardTitle>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                ✕
              </Button>
            </CardHeader>

            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Checkout Form */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Step Indicator */}
                  <div className="flex items-center gap-4 mb-8">
                    {[1, 2, 3].map((step) => (
                      <div key={step} className="flex items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                            currentStep >= step
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {step}
                        </div>
                        {step < 3 && (
                          <div
                            className={`w-12 h-1 ml-2 ${
                              currentStep > step ? "bg-primary" : "bg-muted"
                            }`}
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Step 1: Contact Information */}
                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Package className="w-5 h-5" />
                        Contact Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email || ''}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            placeholder="your@email.com"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number *</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={formData.phone || ''}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            placeholder="(555) 123-4567"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="firstName">First Name *</Label>
                          <Input
                            id="firstName"
                            value={formData.firstName || ''}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            placeholder="John"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input
                            id="lastName"
                            value={formData.lastName || ''}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            placeholder="Doe"
                            required
                          />
                        </div>
                      </div>
                      <Button 
                        onClick={() => setCurrentStep(2)} 
                        className="w-full"
                        variant="hero"
                        disabled={!formData.email || !formData.firstName || !formData.lastName || !formData.phone}
                      >
                        Continue to Delivery
                      </Button>
                    </div>
                  )}

                  {/* Step 2: Delivery Information */}
                  {currentStep === 2 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        Delivery Address
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="address">Street Address *</Label>
                          <Input
                            id="address"
                            value={formData.address || ''}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            placeholder="123 Main Street"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="city">City *</Label>
                            <Input
                              id="city"
                              value={formData.city || ''}
                              onChange={(e) => handleInputChange('city', e.target.value)}
                              placeholder="New York"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="state">State *</Label>
                            <Input
                              id="state"
                              value={formData.state || ''}
                              onChange={(e) => handleInputChange('state', e.target.value)}
                              placeholder="NY"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="zipCode">ZIP Code *</Label>
                            <Input
                              id="zipCode"
                              value={formData.zipCode || ''}
                              onChange={(e) => handleInputChange('zipCode', e.target.value)}
                              placeholder="10001"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="deliveryNotes">Delivery Notes (Optional)</Label>
                          <Textarea
                            id="deliveryNotes"
                            value={formData.deliveryNotes || ''}
                            onChange={(e) => handleInputChange('deliveryNotes', e.target.value)}
                            placeholder="Any special delivery instructions..."
                            rows={3}
                          />
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button 
                          onClick={() => setCurrentStep(1)} 
                          variant="outline"
                          className="flex-1"
                        >
                          Back
                        </Button>
                        <Button 
                          onClick={() => setCurrentStep(3)} 
                          className="flex-1"
                          variant="hero"
                          disabled={!formData.address || !formData.city || !formData.state || !formData.zipCode}
                        >
                          Continue to Payment
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Payment Information */}
                  {currentStep === 3 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <CreditCard className="w-5 h-5" />
                        Payment Information
                      </h3>
                      <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                        <p className="text-sm text-warning-foreground">
                          <strong>Demo Mode:</strong> This is a demonstration. No real payments will be processed.
                        </p>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="cardNumber">Card Number *</Label>
                          <Input
                            id="cardNumber"
                            value={formData.cardNumber || ''}
                            onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                            placeholder="1234 5678 9012 3456"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiryDate">Expiry Date *</Label>
                            <Input
                              id="expiryDate"
                              value={formData.expiryDate || ''}
                              onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                              placeholder="MM/YY"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="cvv">CVV *</Label>
                            <Input
                              id="cvv"
                              value={formData.cvv || ''}
                              onChange={(e) => handleInputChange('cvv', e.target.value)}
                              placeholder="123"
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button 
                          onClick={() => setCurrentStep(2)} 
                          variant="outline"
                          className="flex-1"
                        >
                          Back
                        </Button>
                        <Button 
                          onClick={handleSubmit}
                          className="flex-1"
                          variant="success"
                          disabled={isSubmitting || !formData.cardNumber || !formData.expiryDate || !formData.cvv}
                        >
                          {isSubmitting ? (
                            <div className="w-4 h-4 border-2 border-success-foreground border-t-transparent rounded-full animate-spin" />
                          ) : (
                            "Place Order"
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <Card className="bg-muted/20">
                    <CardHeader>
                      <CardTitle className="text-lg">Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center text-sm">
                          <div className="flex-1">
                            <p className="font-medium line-clamp-1">{item.name}</p>
                            <p className="text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                          <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                      <div className="border-t pt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Subtotal:</span>
                          <span>${total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Shipping:</span>
                          <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Tax:</span>
                          <span>${tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold border-t pt-2">
                          <span>Total:</span>
                          <span className="text-primary">${finalTotal.toFixed(2)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};