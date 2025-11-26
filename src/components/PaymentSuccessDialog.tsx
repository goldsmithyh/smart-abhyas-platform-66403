import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PaymentSuccessDialogProps {
  open: boolean;
  onDownload: () => void;
  onGoToTop: () => void;
}

const PaymentSuccessDialog = ({ open, onDownload, onGoToTop }: PaymentSuccessDialogProps) => {
  const socialLinks = [
    { name: "Instagram", icon: "fab fa-instagram", href: "https://www.instagram.com/smartshikshan" },
    { name: "Facebook", icon: "fab fa-facebook-f", href: "https://www.facebook.com/smartlyshikshan" },
    { name: "YouTube", icon: "fab fa-youtube", href: "https://www.youtube.com/@smartlyshikshan" },
    { name: "WhatsApp", icon: "fab fa-whatsapp", href: "https://wa.me/919730100160" }
  ];

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-lg bg-pink-100 dark:bg-pink-900/20 border-2 border-foreground/20">
        <div className="space-y-6 py-4">
          {/* Success Message in Marathi */}
          <div className="text-center space-y-2">
            <p className="text-lg font-semibold text-primary">
              आपली PDF डाउनलोड प्रक्रिया यशस्वीरित्या पूर्ण झालेली आहे.
            </p>
            <p className="text-base font-medium text-foreground">
              कृपया PDF डाउनलोड करता.
            </p>
          </div>

          {/* Download Button */}
          <div className="flex justify-center">
            <Button 
              onClick={onDownload}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg font-bold rounded-full shadow-lg"
              size="lg"
            >
              Download PDF
            </Button>
          </div>

          {/* Smart Creations Button */}
          <div className="text-center space-y-2">
            <p className="text-sm font-medium text-foreground">
              पुन्हा वेबसाईटवर जाण्यासाठी खाली क्लिक करा.
            </p>
            <Button 
              onClick={onGoToTop}
              variant="outline"
              className="bg-white dark:bg-background border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-bold text-lg px-6 py-5"
              size="lg"
            >
              स्मार्ट क्रिएशन्स
            </Button>
          </div>

          {/* Social Media Links */}
          <div className="space-y-3 pt-4">
            <p className="text-center text-base font-semibold text-foreground">
              कृपया आम्हाला follow करा.
            </p>
            <div className="flex justify-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 bg-white dark:bg-background rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md"
                  aria-label={social.name}
                >
                  <i className={`${social.icon} text-2xl text-foreground`}></i>
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
