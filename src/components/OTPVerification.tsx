import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface OTPVerificationProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onVerified: () => void;
}

export const OTPVerification: React.FC<OTPVerificationProps> = ({
  isOpen,
  onClose,
  email,
  onVerified
}) => {
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const { toast } = useToast();

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a 6-digit code.",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    try {
      const { error } = await supabase.functions.invoke('verify-otp', {
        body: { email, otpCode: otp }
      });

      if (error) throw error;

      toast({
        title: "Email verified!",
        description: "Your email has been successfully verified.",
      });
      
      onVerified();
      onClose();
    } catch (error: any) {
      toast({
        title: "Verification failed",
        description: error.message || "Please check your code and try again.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    try {
      const { error } = await supabase.functions.invoke('send-otp', {
        body: { email }
      });

      if (error) throw error;

      toast({
        title: "Code resent",
        description: "A new verification code has been sent to your email.",
      });
      setOtp('');
    } catch (error: any) {
      toast({
        title: "Failed to resend",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Verify Your Email</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              We've sent a verification code to:
            </p>
            <p className="font-medium">{email}</p>
            <p className="text-sm text-muted-foreground">
              Enter the 6-digit code below to verify your email.
            </p>
          </div>

          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => setOtp(value)}
              disabled={isVerifying}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleVerifyOTP}
              disabled={otp.length !== 6 || isVerifying}
              className="w-full"
            >
              {isVerifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verify Email
            </Button>

            <div className="text-center">
              <Button
                variant="ghost"
                onClick={handleResendOTP}
                disabled={isResending}
                className="text-sm"
              >
                {isResending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Resend code
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};