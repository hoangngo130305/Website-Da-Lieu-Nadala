import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { Shield, AlertTriangle } from "lucide-react";

interface FormField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'textarea';
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  sanitize?: boolean;
}

interface SecureFormProps {
  fields: FormField[];
  onSubmit: (data: Record<string, string>) => void;
  title: string;
  submitLabel: string;
  className?: string;
}

export function SecureForm({ fields, onSubmit, title, submitLabel, className = "" }: SecureFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [securityWarning, setSecurityWarning] = useState("");

  // Sanitize input to prevent XSS
  const sanitizeInput = (value: string): string => {
    return value
      .replace(/[<>]/g, '') // Remove < and > characters
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .trim();
  };

  // Validate individual field
  const validateField = (field: FormField, value: string): string | null => {
    if (field.required && !value.trim()) {
      return `${field.label} là trường bắt buộc`;
    }

    if (field.minLength && value.length < field.minLength) {
      return `${field.label} phải có ít nhất ${field.minLength} ký tự`;
    }

    if (field.maxLength && value.length > field.maxLength) {
      return `${field.label} không được vượt quá ${field.maxLength} ký tự`;
    }

    if (field.pattern && !field.pattern.test(value)) {
      switch (field.type) {
        case 'email':
          return 'Email không đúng định dạng';
        case 'tel':
          return 'Số điện thoại không đúng định dạng';
        default:
          return `${field.label} không đúng định dạng`;
      }
    }

    return null;
  };

  // Handle input change with validation
  const handleInputChange = (fieldId: string, value: string) => {
    const field = fields.find(f => f.id === fieldId);
    if (!field) return;

    // Sanitize if required
    const sanitizedValue = field.sanitize !== false ? sanitizeInput(value) : value;

    // Update form data
    setFormData(prev => ({ ...prev, [fieldId]: sanitizedValue }));

    // Validate field
    const error = validateField(field, sanitizedValue);
    setErrors(prev => ({ ...prev, [fieldId]: error || '' }));

    // Check for potential security issues
    if (value !== sanitizedValue) {
      setSecurityWarning("Đã phát hiện và loại bỏ nội dung có thể gây hại");
      setTimeout(() => setSecurityWarning(""), 3000);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate all fields
    const newErrors: Record<string, string> = {};
    let hasErrors = false;

    fields.forEach(field => {
      const value = formData[field.id] || '';
      const error = validateField(field, value);
      if (error) {
        newErrors[field.id] = error;
        hasErrors = true;
      }
    });

    setErrors(newErrors);

    if (!hasErrors) {
      try {
        // Additional security check - rate limiting simulation
        const lastSubmission = localStorage.getItem('lastFormSubmission');
        const now = Date.now();
        if (lastSubmission && now - parseInt(lastSubmission) < 5000) {
          setSecurityWarning("Vui lòng đợi 5 giây trước khi gửi lại form");
          setIsSubmitting(false);
          return;
        }

        localStorage.setItem('lastFormSubmission', now.toString());

        // Submit form data
        await onSubmit(formData);
        
        // Reset form
        setFormData({});
        setErrors({});
      } catch (error) {
        setSecurityWarning("Có lỗi xảy ra. Vui lòng thử lại sau.");
      }
    }

    setIsSubmitting(false);
  };

  const renderField = (field: FormField) => {
    const value = formData[field.id] || '';
    const error = errors[field.id];

    const commonProps = {
      id: field.id,
      value,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
        handleInputChange(field.id, e.target.value),
      className: error ? 'border-red-500 focus:border-red-500' : '',
      autoComplete: field.type === 'email' ? 'email' : field.type === 'tel' ? 'tel' : 'off'
    };

    switch (field.type) {
      case 'textarea':
        return (
          <Textarea
            {...commonProps}
            placeholder={`Nhập ${field.label.toLowerCase()}`}
            rows={4}
          />
        );
      case 'email':
        return (
          <Input
            {...commonProps}
            type="email"
            placeholder={`Nhập ${field.label.toLowerCase()}`}
          />
        );
      case 'tel':
        return (
          <Input
            {...commonProps}
            type="tel"
            placeholder="VD: 0909123456"
          />
        );
      default:
        return (
          <Input
            {...commonProps}
            type="text"
            placeholder={`Nhập ${field.label.toLowerCase()}`}
          />
        );
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-5 h-5 text-green-600" />
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>

      {securityWarning && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="w-4 h-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            {securityWarning}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map(field => (
          <div key={field.id}>
            <Label htmlFor={field.id} className="flex items-center gap-1">
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </Label>
            {renderField(field)}
            {errors[field.id] && (
              <p className="text-sm text-red-600 mt-1">{errors[field.id]}</p>
            )}
          </div>
        ))}

        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? 'Đang gửi...' : submitLabel}
        </Button>
      </form>

      <div className="text-xs text-gray-500 flex items-center gap-2">
        <Shield className="w-3 h-3" />
        <span>Form này được bảo vệ khỏi spam và các cuộc tấn công độc hại</span>
      </div>
    </div>
  );
}

// Pre-configured form configurations
export const bookingFormFields: FormField[] = [
  {
    id: 'name',
    label: 'Họ và tên',
    type: 'text',
    required: true,
    minLength: 2,
    maxLength: 50
  },
  {
    id: 'phone',
    label: 'Số điện thoại',
    type: 'tel',
    required: true,
    pattern: /^[0-9+\-\s()]{10,15}$/
  },
  {
    id: 'email',
    label: 'Email',
    type: 'email',
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  {
    id: 'service',
    label: 'Dịch vụ quan tâm',
    type: 'text',
    required: true,
    maxLength: 100
  },
  {
    id: 'message',
    label: 'Ghi chú',
    type: 'textarea',
    maxLength: 500
  }
];

export const contactFormFields: FormField[] = [
  {
    id: 'name',
    label: 'Họ và tên',
    type: 'text',
    required: true,
    minLength: 2,
    maxLength: 50
  },
  {
    id: 'email',
    label: 'Email',
    type: 'email',
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  {
    id: 'subject',
    label: 'Chủ đề',
    type: 'text',
    required: true,
    maxLength: 100
  },
  {
    id: 'message',
    label: 'Tin nhắn',
    type: 'textarea',
    required: true,
    minLength: 10,
    maxLength: 1000
  }
];