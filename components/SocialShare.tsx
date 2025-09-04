import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Share2, Facebook, Instagram, MessageCircle } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

interface SocialShareProps {
  url?: string;
  title?: string;
  description?: string;
}

export function SocialShare({ 
  url = window.location.href, 
  title = "Nadala Dermatology Clinic",
  description = "Phòng khám da liễu chuyên nghiệp tại TP.HCM"
}: SocialShareProps) {
  const { t } = useLanguage();

  const shareOnFacebook = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&t=${encodeURIComponent(title)}`;
    window.open(fbUrl, '_blank', 'width=600,height=400');
  };

  const shareOnInstagram = () => {
    // Instagram doesn't have direct sharing API, so we copy to clipboard
    navigator.clipboard.writeText(`${title}\n\n${description}\n\n${url}`);
    alert('Đã copy link! Bạn có thể paste vào Instagram.');
  };

  const shareOnZalo = () => {
    const zaloUrl = `https://zalo.me/share?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
    window.open(zaloUrl, '_blank', 'width=600,height=400');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    alert('Đã copy link vào clipboard!');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="w-4 h-4" />
          {t('social.share')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={shareOnFacebook} className="gap-3">
          <Facebook className="w-4 h-4 text-blue-600" />
          {t('social.share_facebook')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareOnInstagram} className="gap-3">
          <Instagram className="w-4 h-4 text-pink-600" />
          {t('social.share_instagram')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareOnZalo} className="gap-3">
          <MessageCircle className="w-4 h-4 text-blue-500" />
          {t('social.share_zalo')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={copyToClipboard} className="gap-3">
          <Share2 className="w-4 h-4" />
          Copy Link
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}