import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [receiptSent, setReceiptSent] = useState(false);

  useEffect(() => {
    const sendReceipt = async () => {
      if (sessionId && !receiptSent) {
        try {
          const { data, error } = await supabase.functions.invoke('send-receipt', {
            body: { session_id: sessionId }
          });
          
          if (!error) {
            setReceiptSent(true);
          }
        } catch (error) {
          console.error('Error sending receipt:', error);
        }
      }
    };

    sendReceipt();
  }, [sessionId, receiptSent]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-700">
            Payment Successful!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Thank you for your purchase. Your order has been processed successfully.
          </p>
          
          {receiptSent && (
            <div className="flex items-center justify-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
              <Mail className="w-4 h-4" />
              Receipt sent to your email
            </div>
          )}

          <div className="space-y-2 pt-4">
            <Button asChild className="w-full">
              <Link to="/">Continue Shopping</Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link to="/orders">View My Orders</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;