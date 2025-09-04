import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPaymentSuccess: () => void;
}

export const PaymentDialog = ({ open, onOpenChange, onPaymentSuccess }: PaymentDialogProps) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePayment = async () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Initialize Paystack payment
      const handler = (window as any).PaystackPop.setup({
        key: 'pk_test_65b3a56f751efd35b1c840d757326ae94d1ea2d3', // Paystack test public key
        email: email,
        amount: 500, // $5.00 in cents
        currency: 'USD',
        ref: `rem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        callback: async function(response: any) {
          console.log('Payment successful:', response);
          
          try {
            // Verify payment on the server
            const { data, error } = await supabase.functions.invoke('process-payment', {
              body: {
                email: email,
                reference: response.reference,
              },
            });

            if (error) {
              console.error('Payment verification error:', error);
              toast({
                title: "Payment verification failed",
                description: "Please contact support if your card was charged.",
                variant: "destructive",
              });
              return;
            }

            if (data?.success) {
              toast({
                title: "Payment successful!",
                description: "You now have access to reminders feature.",
              });
              onPaymentSuccess();
              onOpenChange(false);
            } else {
              toast({
                title: "Payment verification failed",
                description: "Please contact support if your card was charged.",
                variant: "destructive",
              });
            }
          } catch (verifyError) {
            console.error('Payment verification error:', verifyError);
            toast({
              title: "Payment verification failed",
              description: "Please contact support if your card was charged.",
              variant: "destructive",
            });
          }
        },
        onClose: function() {
          console.log('Payment cancelled');
          setIsLoading(false);
        },
      });

      handler.openIframe();
    } catch (error) {
      console.error('Payment initialization error:', error);
      toast({
        title: "Payment failed",
        description: "Failed to initialize payment. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Unlock Reminders Feature
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-center space-y-2">
            <div className="text-2xl font-bold text-primary">$5.00</div>
            <p className="text-muted-foreground">
              One-time payment to unlock the reminders feature
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handlePayment} 
              className="w-full"
              disabled={isLoading || !email}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Pay with Paystack
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full"
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Secure payment powered by Paystack. Your payment information is encrypted and secure.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};