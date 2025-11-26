import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Home } from "lucide-react";

interface PaymentSuccessDialogProps {
  open: boolean;
  onDownload: () => void;
  onGoToTop: () => void;
}

const PaymentSuccessDialog = ({ open, onDownload, onGoToTop }: PaymentSuccessDialogProps) => {
  const socialLinks = [
    { name: "Facebook", icon: "fab fa-facebook-f", href: "https://www.facebook.com/smartlyshikshan", color: "hover:bg-blue-600" },
    { name: "Instagram", icon: "fab fa-instagram", href: "https://www.instagram.com/smartshikshan", color: "hover:bg-pink-600" },
    { name: "YouTube", icon: "fab fa-youtube", href: "https://www.youtube.com/@smartlyshikshan", color: "hover:bg-red-600" },
    { name: "Telegram", icon: "fab fa-telegram", href: "https://t.me/smartshikshan", color: "hover:bg-blue-500" },
    { name: "WhatsApp", icon: "fab fa-whatsapp", href: "https://wa.me/919730100160", color: "hover:bg-green-600" }
  ];

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center text-primary mb-4">
            🎉 Payment Successful!
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <p className="text-center text-muted-foreground">
            Your payment has been processed successfully. Thank you for your purchase!
          </p>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={onDownload}
              className="w-full"
              size="lg"
            >
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
            <Button 
              onClick={onGoToTop}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <Home className="mr-2 h-4 w-4" />
              Smart Creations
            </Button>
          </div>

          {/* Social Media Links */}
          <div className="space-y-3">
            <p className="text-center text-sm text-muted-foreground">Connect with us</p>
            <div className="flex justify-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-700 dark:text-white transition-all duration-300 hover:scale-110 ${social.color}`}
                  aria-label={social.name}
                >
                  <i className={social.icon}></i>
                </a>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentSuccessDialog;
