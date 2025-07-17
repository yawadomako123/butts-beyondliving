import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, ArrowLeft } from 'lucide-react';

const PaymentCanceled = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-destructive/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-700">
            Payment Canceled
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Your payment was canceled. No charges have been made to your account.
          </p>

          <div className="space-y-2 pt-4">
            <Button asChild className="w-full">
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Return to Shop
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link to="/cart">Back to Cart</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentCanceled;