import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

interface FormData {
  businessName: string;
  businessType: string;
  businessDuration: string;
  businessLocation: string;
  campaignGoal: string;
  desiredAction: string;
  dailyBudget: string;
  campaignDuration: string;
  startDate: string;
  targetLocation: string;
  targetAgeGroup: string;
  targetGender: string;
  idealCustomer: string;
  audienceInterests: string;
  offering: string;
  priceRange: string;
  offersDiscounts: string;
  usp: string;
  leadDirection: string;
  contactNumber: string;
  leadManager: string;
  responseTime: string;
  previousAds: string;
  pastResults: string;
  customerDatabase: string;
  facebookPage: string;
  instagramPage: string;
  website: string;
  googleBusinessProfile: string;
  availableCreatives: string;
  needNewCreatives: string;
  creativeMessage: string;
  adAccountType: string;
  hasMetaBusinessManager: string;
  adAccountAccess: string;
  facebookPageAccess: string;
  instagramAccountAccess: string;
  reportingFrequency: string;
  successMetrics: string;
  additionalNotes: string;
}

const initialFormData: FormData = {
  businessName: '',
  businessType: '',
  businessDuration: '',
  businessLocation: '',
  campaignGoal: '',
  desiredAction: '',
  dailyBudget: '',
  campaignDuration: '',
  startDate: '',
  targetLocation: '',
  targetAgeGroup: '',
  targetGender: '',
  idealCustomer: '',
  audienceInterests: '',
  offering: '',
  priceRange: '',
  offersDiscounts: '',
  usp: '',
  leadDirection: '',
  contactNumber: '',
  leadManager: '',
  responseTime: '',
  previousAds: '',
  pastResults: '',
  customerDatabase: '',
  facebookPage: '',
  instagramPage: '',
  website: '',
  googleBusinessProfile: '',
  availableCreatives: '',
  needNewCreatives: '',
  creativeMessage: '',
  adAccountType: '',
  hasMetaBusinessManager: '',
  adAccountAccess: '',
  facebookPageAccess: '',
  instagramAccountAccess: '',
  reportingFrequency: '',
  successMetrics: '',
  additionalNotes: '',
};

export default function OnboardingForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState<number | null>(null);

  const submitMutation = trpc.form.submit.useMutation();

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = (): boolean => {
    // Only business name and contact number are required
    if (!formData.businessName.trim()) {
      toast.error('Business Name is required');
      return false;
    }
    if (!formData.contactNumber.trim()) {
      toast.error('Contact Number is required');
      return false;
    }
    if (!termsAccepted) {
      toast.error('You must accept the terms and conditions');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const result = await submitMutation.mutateAsync(formData);
      if (result.success) {
        setSubmitted(true);
        setSubmissionId(result.submissionId);
        toast.success('Form submitted successfully! Email sent to workmj.work@gmail.com');
      }
    } catch (error) {
      toast.error('Failed to submit form. Please try again.');
      console.error(error);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#faf8fc] via-[#fef5f7] to-[#f0faf8] flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl p-8 md:p-12 text-center corner-bracket">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-[#d4c5e2] to-[#c8b8d8] mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#4a3f5c]">Thank You!</h1>
          <p className="text-lg text-[#6b5f7f] mb-2">Your onboarding form has been submitted successfully.</p>
          <p className="text-sm text-[#a89fb8] mb-2">Submission ID: <span className="font-mono font-semibold">{submissionId}</span></p>
          <p className="text-[#6b5f7f] mb-8">A detailed email with all your information has been sent to <strong>workmj.work@gmail.com</strong>. We will review your details and get back to you shortly.</p>
          <Button 
            onClick={() => {
              setSubmitted(false);
              setFormData(initialFormData);
              setTermsAccepted(false);
            }}
            className="button-primary"
          >
            Submit Another Form
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#faf8fc] via-[#fef5f7] to-[#f0faf8] py-8 md:py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 md:mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-[#4a3f5c]">Meta Ads Onboarding</h1>
          <p className="text-lg text-[#6b5f7f]">Complete your client information to get started</p>
        </div>

        {/* Form */}
        <Card className="form-section mb-8 vertical-accent">
          <div className="section-divider mb-8" />

          {/* Section 1: Business Information */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[#4a3f5c]">1. Business Information</h2>
            <div className="space-y-6">
              <FormField label="Business Name *" value={formData.businessName} onChange={(v) => handleInputChange('businessName', v)} placeholder="Enter your business name" />
              <FormField label="Business Type (Product/Service)" value={formData.businessType} onChange={(v) => handleInputChange('businessType', v)} placeholder="e.g., E-commerce, Services, Retail" />
              <FormField label="How long have you been in the market?" value={formData.businessDuration} onChange={(v) => handleInputChange('businessDuration', v)} placeholder="e.g., 2 years, 6 months" />
              <FormField label="Business Location (City and Area)" value={formData.businessLocation} onChange={(v) => handleInputChange('businessLocation', v)} placeholder="e.g., Mumbai, Bandra" />
            </div>
          </div>

          <div className="section-divider" />

          {/* Section 2: Campaign Objective */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[#4a3f5c]">2. Campaign Objective</h2>
            <div className="space-y-6">
              <FormSelect 
                label="What is your primary goal from this ad campaign?"
                value={formData.campaignGoal}
                onChange={(v) => handleInputChange('campaignGoal', v)}
                options={['Leads', 'Calls', 'WhatsApp Messages', 'Website Sales', 'Store Visits']}
              />
              <FormField 
                label="What action do you want users to take after seeing the ad?" 
                value={formData.desiredAction} 
                onChange={(v) => handleInputChange('desiredAction', v)} 
                placeholder="Describe the desired user action"
                isTextarea
              />
            </div>
          </div>

          <div className="section-divider" />

          {/* Section 3: Budget and Duration */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[#4a3f5c]">3. Budget and Duration</h2>
            <div className="space-y-6">
              <FormField label="Daily Ad Budget (INR)" value={formData.dailyBudget} onChange={(v) => handleInputChange('dailyBudget', v)} placeholder="e.g., 500, 1000" />
              <FormField label="Total Campaign Duration (Number of days)" value={formData.campaignDuration} onChange={(v) => handleInputChange('campaignDuration', v)} placeholder="e.g., 30, 60" />
              <FormField label="Preferred Start Date" value={formData.startDate} onChange={(v) => handleInputChange('startDate', v)} type="date" />
            </div>
          </div>

          <div className="section-divider" />

          {/* Section 4: Target Audience */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[#4a3f5c]">4. Target Audience</h2>
            <div className="space-y-6">
              <FormField label="Target Location (specific area or radius in KM)" value={formData.targetLocation} onChange={(v) => handleInputChange('targetLocation', v)} placeholder="e.g., 5 KM radius from Mumbai" />
              <FormSelect 
                label="Target Age Group"
                value={formData.targetAgeGroup}
                onChange={(v) => handleInputChange('targetAgeGroup', v)}
                options={['18-24', '25-34', '35-44', '45-54', '55-64', '65+']}
              />
              <FormSelect 
                label="Target Gender"
                value={formData.targetGender}
                onChange={(v) => handleInputChange('targetGender', v)}
                options={['Male', 'Female', 'All']}
              />
              <FormField 
                label="Describe your ideal customer" 
                value={formData.idealCustomer} 
                onChange={(v) => handleInputChange('idealCustomer', v)} 
                placeholder="Describe your ideal customer profile"
                isTextarea
              />
              <FormField 
                label="Any specific interests, behaviors, or audience targeting preferences" 
                value={formData.audienceInterests} 
                onChange={(v) => handleInputChange('audienceInterests', v)} 
                placeholder="e.g., Tech enthusiasts, Fitness lovers"
                isTextarea
              />
            </div>
          </div>

          <div className="section-divider" />

          {/* Section 5: Product/Service Details */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[#4a3f5c]">5. Product/Service Details</h2>
            <div className="space-y-6">
              <FormField 
                label="What are you offering? (Brief description)" 
                value={formData.offering} 
                onChange={(v) => handleInputChange('offering', v)} 
                placeholder="Describe your product or service"
                isTextarea
              />
              <FormField label="Price Range" value={formData.priceRange} onChange={(v) => handleInputChange('priceRange', v)} placeholder="e.g., ₹500 - ₹2000" />
              <FormField 
                label="Any ongoing offers or discounts?" 
                value={formData.offersDiscounts} 
                onChange={(v) => handleInputChange('offersDiscounts', v)} 
                placeholder="Describe any current offers"
                isTextarea
              />
              <FormField 
                label="What makes your business unique (USP)?" 
                value={formData.usp} 
                onChange={(v) => handleInputChange('usp', v)} 
                placeholder="Describe your unique selling proposition"
                isTextarea
              />
            </div>
          </div>

          <div className="section-divider" />

          {/* Section 6: Lead Handling */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[#4a3f5c]">6. Lead Handling and Conversion Path</h2>
            <div className="space-y-6">
              <FormSelect 
                label="Where should leads or messages be directed?"
                value={formData.leadDirection}
                onChange={(v) => handleInputChange('leadDirection', v)}
                options={['WhatsApp', 'Phone Call', 'Facebook Inbox', 'Website Form']}
              />
              <FormField label="Contact Number or WhatsApp Number *" value={formData.contactNumber} onChange={(v) => handleInputChange('contactNumber', v)} placeholder="e.g., +91 9876543210" />
              <FormField label="Who will manage incoming leads or messages?" value={formData.leadManager} onChange={(v) => handleInputChange('leadManager', v)} placeholder="Name or department" />
              <FormSelect 
                label="Expected response time"
                value={formData.responseTime}
                onChange={(v) => handleInputChange('responseTime', v)}
                options={['Immediate (within 5 mins)', 'Within 1 hour', 'Within 24 hours', 'Within 48 hours']}
              />
            </div>
          </div>

          <div className="section-divider" />

          {/* Section 7: Previous Advertising Data */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[#4a3f5c]">7. Previous Advertising Data</h2>
            <div className="space-y-6">
              <FormSelect 
                label="Have you run ads before?"
                value={formData.previousAds}
                onChange={(v) => handleInputChange('previousAds', v)}
                options={['Yes', 'No']}
              />
              {formData.previousAds === 'Yes' && (
                <FormField 
                  label="If yes, share past results (leads, sales, cost per lead, etc.)" 
                  value={formData.pastResults} 
                  onChange={(v) => handleInputChange('pastResults', v)} 
                  placeholder="Share your previous advertising results"
                  isTextarea
                />
              )}
              <FormSelect 
                label="Do you have any customer database (phone numbers, email list)?"
                value={formData.customerDatabase}
                onChange={(v) => handleInputChange('customerDatabase', v)}
                options={['Yes', 'No']}
              />
            </div>
          </div>

          <div className="section-divider" />

          {/* Section 8: Online Presence */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[#4a3f5c]">8. Online Presence</h2>
            <div className="space-y-6">
              <FormField label="Facebook Page Link" value={formData.facebookPage} onChange={(v) => handleInputChange('facebookPage', v)} placeholder="https://facebook.com/..." />
              <FormField label="Instagram Page Link" value={formData.instagramPage} onChange={(v) => handleInputChange('instagramPage', v)} placeholder="https://instagram.com/..." />
              <FormField label="Website Link (if available)" value={formData.website} onChange={(v) => handleInputChange('website', v)} placeholder="https://yourwebsite.com" />
              <FormField label="Google Business Profile Link (if available)" value={formData.googleBusinessProfile} onChange={(v) => handleInputChange('googleBusinessProfile', v)} placeholder="https://google.com/business/..." />
            </div>
          </div>

          <div className="section-divider" />

          {/* Section 9: Creatives */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[#4a3f5c]">9. Creatives</h2>
            <div className="space-y-6">
              <FormSelect 
                label="Available creatives"
                value={formData.availableCreatives}
                onChange={(v) => handleInputChange('availableCreatives', v)}
                options={['Video', 'Images', 'Both']}
              />
              <FormSelect 
                label="Do you require new creatives to be created?"
                value={formData.needNewCreatives}
                onChange={(v) => handleInputChange('needNewCreatives', v)}
                options={['Yes', 'No']}
              />
              <FormField 
                label="Any specific message, offer, or angle you want to highlight" 
                value={formData.creativeMessage} 
                onChange={(v) => handleInputChange('creativeMessage', v)} 
                placeholder="Describe the message or angle for your ads"
                isTextarea
              />
            </div>
          </div>

          <div className="section-divider" />

          {/* Section 10: Access and Permissions */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[#4a3f5c]">10. Access and Permissions</h2>
            <div className="space-y-6">
              <FormSelect 
                label="Ad Account to be used"
                value={formData.adAccountType}
                onChange={(v) => handleInputChange('adAccountType', v)}
                options={['Team Account', 'Business Owner Account']}
              />
              <FormSelect 
                label="Do you have Meta Business Manager?"
                value={formData.hasMetaBusinessManager}
                onChange={(v) => handleInputChange('hasMetaBusinessManager', v)}
                options={['Yes', 'No']}
              />
              <FormSelect 
                label="Ad Account Access"
                value={formData.adAccountAccess}
                onChange={(v) => handleInputChange('adAccountAccess', v)}
                options={['Admin', 'Editor', 'Analyst', 'Advertiser']}
              />
              <FormSelect 
                label="Facebook Page Access"
                value={formData.facebookPageAccess}
                onChange={(v) => handleInputChange('facebookPageAccess', v)}
                options={['Admin', 'Editor', 'Moderator', 'Analyst']}
              />
              <FormSelect 
                label="Instagram Account Access"
                value={formData.instagramAccountAccess}
                onChange={(v) => handleInputChange('instagramAccountAccess', v)}
                options={['Admin', 'Editor', 'Moderator', 'Analyst']}
              />
            </div>
          </div>

          <div className="section-divider" />

          {/* Section 11: Reporting and Expectations */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[#4a3f5c]">11. Reporting and Expectations</h2>
            <div className="space-y-6">
              <FormSelect 
                label="Preferred reporting frequency"
                value={formData.reportingFrequency}
                onChange={(v) => handleInputChange('reportingFrequency', v)}
                options={['Every 3 days', 'Weekly', 'Bi-weekly', 'Monthly']}
              />
              <FormField 
                label="What defines success for you? (Leads, Sales, ROI, etc.)" 
                value={formData.successMetrics} 
                onChange={(v) => handleInputChange('successMetrics', v)} 
                placeholder="Define your success metrics"
                isTextarea
              />
            </div>
          </div>

          <div className="section-divider" />

          {/* Section 12: Additional Notes */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[#4a3f5c]">12. Additional Notes</h2>
            <div className="space-y-6">
              <FormField 
                label="Any additional instructions, expectations, or important details" 
                value={formData.additionalNotes} 
                onChange={(v) => handleInputChange('additionalNotes', v)} 
                placeholder="Share any additional information"
                isTextarea
              />
            </div>
          </div>

          <div className="section-divider mb-8" />

          {/* Terms and Conditions */}
          <div className="bg-white/50 rounded-lg p-6 md:p-8 mb-8 border border-white/60 max-h-96 overflow-y-auto">
            <h3 className="text-xl font-bold mb-4 text-[#4a3f5c]">Terms & Confirmation</h3>
            <div className="space-y-3 text-[#4a3f5c] text-sm md:text-base leading-relaxed">
              <p><strong>1. Information Accuracy:</strong> I confirm that all information provided in this onboarding form is accurate and truthful to the best of my knowledge.</p>
              <p><strong>2. Authorization:</strong> I am authorized to provide this information on behalf of the business.</p>
              <p><strong>3. Data Privacy:</strong> I consent to the processing of this data for Meta Ads campaign setup and management.</p>
              <p><strong>4. Campaign Objectives:</strong> I acknowledge that the campaign objectives and budget information are realistic and achievable.</p>
              <p><strong>5. Compliance:</strong> I agree to comply with all Meta advertising policies and guidelines.</p>
              <p><strong>6. Communication:</strong> I authorize contact using the provided information for campaign management and follow-up.</p>
            </div>
          </div>

          {/* Acknowledgement Checkbox */}
          <div className="flex items-start gap-4 mb-8 p-4 bg-[#f5f1fa] rounded-lg border border-[#e5ddf0]">
            <Checkbox 
              id="terms"
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
              className="mt-1"
            />
            <label htmlFor="terms" className="text-sm md:text-base text-[#4a3f5c] cursor-pointer">
              I have read and agree to all the terms and conditions. I confirm that all information provided is accurate and I authorize this submission.
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button 
              onClick={handleSubmit}
              disabled={!termsAccepted || submitMutation.isPending}
              className={`button-primary ${!termsAccepted ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {submitMutation.isPending ? 'Submitting...' : 'Submit Form'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

interface FormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  isTextarea?: boolean;
}

function FormField({ label, value, onChange, placeholder, type = 'text', isTextarea = false }: FormFieldProps) {
  return (
    <div>
      <label className="label-text">{label}</label>
      {isTextarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="input-field min-h-32 resize-none"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="input-field"
        />
      )}
    </div>
  );
}

interface FormSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}

function FormSelect({ label, value, onChange, options }: FormSelectProps) {
  return (
    <div>
      <label className="label-text">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-field"
      >
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
