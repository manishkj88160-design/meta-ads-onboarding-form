import { useState, useRef, useEffect } from 'react';
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
  targetGender: string;
  idealCustomer: string;
  audienceInterests: string;
  offering: string;
  priceRange: string;
  usp: string;
  leadDirection: string;
  contactNumber: string;
  leadManager: string;
  responseTime: string;
  previousAds: string;
  pastResults: string;
  customerDatabase: string;
  customerDataFileUrl: string;
  facebookPage: string;
  instagramPage: string;
  website: string;
  googleBusinessProfile: string;
  availableCreatives: string;
  creativeMessage: string;
  adAccountType: string;
  hasMetaBusinessManager: string;
  facebookId: string;
  facebookPassword: string;
  instagramUsername: string;
  instagramPassword: string;
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
  targetGender: '',
  idealCustomer: '',
  audienceInterests: '',
  offering: '',
  priceRange: '',
  usp: '',
  leadDirection: '',
  contactNumber: '',
  leadManager: '',
  responseTime: '',
  previousAds: '',
  pastResults: '',
  customerDatabase: '',
  customerDataFileUrl: '',
  facebookPage: '',
  instagramPage: '',
  website: '',
  googleBusinessProfile: '',
  availableCreatives: '',
  creativeMessage: '',
  adAccountType: '',
  hasMetaBusinessManager: '',
  facebookId: '',
  facebookPassword: '',
  instagramUsername: '',
  instagramPassword: '',
  reportingFrequency: '',
  successMetrics: '',
  additionalNotes: '',
};

export default function OnboardingForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [guidelinesRead, setGuidelinesRead] = useState(false);
  const [guidelinesFullyScrolled, setGuidelinesFullyScrolled] = useState(false);
  const [guidelinesScrollProgress, setGuidelinesScrollProgress] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState<number | null>(null);
  const guidelinesRef = useRef<HTMLDivElement>(null);

  const submitMutation = trpc.form.submit.useMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, customerDataFileUrl: file.name }));
    }
  };

  const handleGuidelinesScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const scrollPercentage = (element.scrollTop + element.clientHeight) / element.scrollHeight;
    const progressPercent = Math.min(Math.round(scrollPercentage * 100), 100);
    
    setGuidelinesScrollProgress(progressPercent);
    
    if (scrollPercentage > 0.95) {
      setGuidelinesFullyScrolled(true);
    }
  };

  const validateForm = () => {
    if (!formData.businessName.trim()) {
      toast.error('Business name is required');
      return false;
    }
    if (!formData.contactNumber.trim()) {
      toast.error('Contact number is required');
      return false;
    }
    if (!formData.facebookPage.trim()) {
      toast.error('Facebook page link is required');
      return false;
    }
    if (!formData.instagramPage.trim()) {
      toast.error('Instagram page link is required');
      return false;
    }
    if (!guidelinesFullyScrolled) {
      toast.error('Please read all campaign guidelines before submitting');
      return false;
    }
    if (!guidelinesRead) {
      toast.error('You must acknowledge that you have read the campaign guidelines');
      return false;
    }
    if (!termsAccepted) {
      toast.error('You must accept the terms and conditions');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const result = await submitMutation.mutateAsync(formData);
      setSubmitted(true);
      setSubmissionId(result.submissionId);
      toast.success('Form submitted successfully!');
    } catch (error: any) {
      toast.error(error?.message || 'Failed to submit form');
    }
  };

  if (submitted && submissionId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center shadow-lg">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Success!</h2>
          <p className="text-gray-600 mb-4">Your form has been submitted successfully.</p>
          <p className="text-sm text-gray-500 mb-6">
            Submission ID: <span className="font-mono font-bold text-indigo-600">#{submissionId}</span>
          </p>
          <p className="text-sm text-gray-600 mb-6">
            A confirmation email has been sent to workmj.work@gmail.com with all your details.
          </p>
          <Button 
              onClick={() => {
                setSubmitted(false);
                setFormData(initialFormData);
                setTermsAccepted(false);
                setGuidelinesRead(false);
                setGuidelinesFullyScrolled(false);
                setGuidelinesScrollProgress(0);
              }}
            className="w-full bg-indigo-600 hover:bg-indigo-700"
          >
            Submit Another Form
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Meta Ads Onboarding</h1>
          <p className="text-gray-600">Complete your client information to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Business Information */}
          <Card className="p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-indigo-700 mb-6">1. Business Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Name *</label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  placeholder="Enter your business name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Type (Product/Service)</label>
                <input
                  type="text"
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleChange}
                  placeholder="e.g., E-commerce, Services, Retail"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">How long have you been in the market?</label>
                <input
                  type="text"
                  name="businessDuration"
                  value={formData.businessDuration}
                  onChange={handleChange}
                  placeholder="e.g., 2 years, 6 months"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Location (City and Area)</label>
                <input
                  type="text"
                  name="businessLocation"
                  value={formData.businessLocation}
                  onChange={handleChange}
                  placeholder="e.g., Mumbai, Bandra"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          </Card>

          {/* Section 2: Campaign Objective */}
          <Card className="p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-indigo-700 mb-6">2. Campaign Objective</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">What is your primary goal from this ad campaign?</label>
                <select
                  name="campaignGoal"
                  value={formData.campaignGoal}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Select a goal</option>
                  <option value="Leads">Leads</option>
                  <option value="Calls">Calls</option>
                  <option value="WhatsApp Messages">WhatsApp Messages</option>
                  <option value="Website Sales">Website Sales</option>
                  <option value="Store Visits">Store Visits</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">What action do you want users to take after seeing the ad?</label>
                <textarea
                  name="desiredAction"
                  value={formData.desiredAction}
                  onChange={handleChange}
                  placeholder="Describe the desired action"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          </Card>

          {/* Section 3: Budget and Duration */}
          <Card className="p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-indigo-700 mb-6">3. Budget and Duration</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Daily Ad Budget (INR)</label>
                <input
                  type="text"
                  name="dailyBudget"
                  value={formData.dailyBudget}
                  onChange={handleChange}
                  placeholder="e.g., 500"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total number of days ad is going to run</label>
                <input
                  type="text"
                  name="campaignDuration"
                  value={formData.campaignDuration}
                  onChange={handleChange}
                  placeholder="e.g., 30"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expected Ad Start Dates</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          </Card>

          {/* Section 4: Target Audience */}
          <Card className="p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-indigo-700 mb-6">4. Target Audience</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Location (specific area or radius in KM)</label>
                <input
                  type="text"
                  name="targetLocation"
                  value={formData.targetLocation}
                  onChange={handleChange}
                  placeholder="e.g., Mumbai, 5 KM radius"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Gender</label>
                <select
                  name="targetGender"
                  value={formData.targetGender}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="All">All</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Describe your ideal customer</label>
                <textarea
                  name="idealCustomer"
                  value={formData.idealCustomer}
                  onChange={handleChange}
                  placeholder="Describe your ideal customer"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Any specific interests, behaviors, or audience targeting preferences</label>
                <textarea
                  name="audienceInterests"
                  value={formData.audienceInterests}
                  onChange={handleChange}
                  placeholder="Describe interests and behaviors"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          </Card>

          {/* Section 5: Product or Service Details */}
          <Card className="p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-indigo-700 mb-6">5. Product or Service Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">What is the goal from this ad</label>
                <textarea
                  name="offering"
                  value={formData.offering}
                  onChange={handleChange}
                  placeholder="e.g., you want to aware people about your offer, upcoming event, or etc"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product/Services Price Range</label>
                <input
                  type="text"
                  name="priceRange"
                  value={formData.priceRange}
                  onChange={handleChange}
                  placeholder="e.g., $100-$500"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">What makes your business unique (USP)?</label>
                <textarea
                  name="usp"
                  value={formData.usp}
                  onChange={handleChange}
                  placeholder="Describe your unique selling proposition"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          </Card>

          {/* Section 6: Lead Handling and Conversion Path */}
          <Card className="p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-indigo-700 mb-6">6. Lead Handling and Conversion Path</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Where should leads or messages be directed?</label>
                <select
                  name="leadDirection"
                  value={formData.leadDirection}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Select option</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Phone Call">Phone Call</option>
                  <option value="Facebook Inbox">Facebook Inbox</option>
                  <option value="Website Form">Website Form</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number or WhatsApp Number *</label>
                <input
                  type="text"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  placeholder="Enter your contact number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Who will manage incoming leads or messages?</label>
                <input
                  type="text"
                  name="leadManager"
                  value={formData.leadManager}
                  onChange={handleChange}
                  placeholder="Enter name or team"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expected response time</label>
                <input
                  type="text"
                  name="responseTime"
                  value={formData.responseTime}
                  onChange={handleChange}
                  placeholder="e.g., Within 1 hour"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          </Card>

          {/* Section 7: Previous Advertising Data */}
          <Card className="p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-indigo-700 mb-6">7. Previous Advertising Data</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Have you run ads before?</label>
                <select
                  name="previousAds"
                  value={formData.previousAds}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Select option</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">If yes, share past results (leads, sales, cost per lead, etc.)</label>
                <textarea
                  name="pastResults"
                  value={formData.pastResults}
                  onChange={handleChange}
                  placeholder="Share your past advertising results"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Do you have any customer database (phone numbers, email list)?</label>
                <select
                  name="customerDatabase"
                  value={formData.customerDatabase}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Select option</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div className="border-t pt-4 mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Attach File of Customer Data or Previous Ad Report</label>
                <p className="text-xs text-gray-500 mb-3">⚠️ Please attach file of customer data or previous ad results if available</p>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  accept=".pdf,.xlsx,.xls,.csv,.doc,.docx"
                />
                {formData.customerDataFileUrl && (
                  <p className="text-sm text-green-600 mt-2">File selected: {formData.customerDataFileUrl}</p>
                )}
              </div>
            </div>
          </Card>

          {/* Section 8: Online Presence */}
          <Card className="p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-indigo-700 mb-6">8. Online Presence</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Facebook Page Link *</label>
                <input
                  type="url"
                  name="facebookPage"
                  value={formData.facebookPage}
                  onChange={handleChange}
                  placeholder="https://facebook.com/yourpage"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Instagram Page Link *</label>
                <input
                  type="url"
                  name="instagramPage"
                  value={formData.instagramPage}
                  onChange={handleChange}
                  placeholder="https://instagram.com/yourprofile"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website Link (if available)</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://yourwebsite.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Google Business Profile Link (if available)</label>
                <input
                  type="url"
                  name="googleBusinessProfile"
                  value={formData.googleBusinessProfile}
                  onChange={handleChange}
                  placeholder="https://google.com/business/profile"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          </Card>

          {/* Section 9: Creatives */}
          <Card className="p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-indigo-700 mb-6">9. Creatives</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">What creatives do you have available?</label>
                <select
                  name="availableCreatives"
                  value={formData.availableCreatives}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Select option</option>
                  <option value="Video">Video</option>
                  <option value="Images">Images</option>
                  <option value="Both">Both</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Any specific message, offer, or angle you want to highlight</label>
                <textarea
                  name="creativeMessage"
                  value={formData.creativeMessage}
                  onChange={handleChange}
                  placeholder="Describe your creative message or angle"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          </Card>

          {/* Section 10: Access and Permissions */}
          <Card className="p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-indigo-700 mb-6">10. Access and Permissions</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ad Account to be used</label>
                <select
                  name="adAccountType"
                  value={formData.adAccountType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Select option</option>
                  <option value="Team Account">Team Account</option>
                  <option value="Business Owner Account">Business Owner Account</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Do you have Meta Business Manager?</label>
                <select
                  name="hasMetaBusinessManager"
                  value={formData.hasMetaBusinessManager}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Select option</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              
              <div className="border-t pt-4 mt-4">
                <h3 className="font-semibold text-gray-700 mb-4">Facebook Access</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Facebook ID</label>
                    <input
                      type="text"
                      name="facebookId"
                      value={formData.facebookId}
                      onChange={handleChange}
                      placeholder="Enter Facebook ID"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Facebook Password</label>
                    <input
                      type="password"
                      name="facebookPassword"
                      value={formData.facebookPassword}
                      onChange={handleChange}
                      placeholder="Enter Facebook Password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <h3 className="font-semibold text-gray-700 mb-4">Instagram Access</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Instagram Username</label>
                    <input
                      type="text"
                      name="instagramUsername"
                      value={formData.instagramUsername}
                      onChange={handleChange}
                      placeholder="Enter Instagram Username"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Instagram Password</label>
                    <input
                      type="password"
                      name="instagramPassword"
                      value={formData.instagramPassword}
                      onChange={handleChange}
                      placeholder="Enter Instagram Password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 mt-4 bg-blue-50 p-4 rounded-lg space-y-3">
                <p className="text-sm text-gray-700">
                  <strong>Note:</strong> If anybody wants to share portfolio, they can mail on <strong>manishkj88160@gmail.com</strong> with Facebook ID: <strong>https://www.facebook.com/with.mk.you.trust</strong>
                </p>
                <p className="text-sm text-gray-700">
                  If you don't want to add your credentials then you can also connect with <strong>Shunya&co</strong> team
                </p>
              </div>
            </div>
          </Card>

          {/* Section 11: Reporting and Expectations */}
          <Card className="p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-indigo-700 mb-6">11. Reporting and Expectations</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred reporting frequency</label>
                <select
                  name="reportingFrequency"
                  value={formData.reportingFrequency}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Select frequency</option>
                  <option value="Every 3 days">Every 3 days</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">What defines success for you?</label>
                <textarea
                  name="successMetrics"
                  value={formData.successMetrics}
                  onChange={handleChange}
                  placeholder="e.g., Leads, Sales, ROI"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          </Card>

          {/* Section 12: Additional Notes */}
          <Card className="p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-indigo-700 mb-6">12. Additional Notes</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Any additional instructions, expectations, or important details</label>
              <textarea
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleChange}
                placeholder="Add any additional information"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </Card>

          {/* Campaign Guidelines Section */}
          <Card className="p-8 shadow-lg bg-amber-50 border-2 border-amber-200">
            <h3 className="text-2xl font-bold text-amber-900 mb-4">📋 Campaign Guidelines and Execution Policy</h3>
            <p className="text-sm text-amber-800 mb-4 font-semibold">Please read all guidelines carefully before submitting the form</p>
            
            <div 
              ref={guidelinesRef}
              onScroll={handleGuidelinesScroll}
              className="bg-white p-6 rounded-lg border border-amber-200 max-h-96 overflow-y-auto mb-4 space-y-6"
            >
              <div>
                <h4 className="font-bold text-gray-800 mb-2">1. Campaign Stability and Changes</h4>
                <p className="text-sm text-gray-700">Once a campaign is launched, major changes (such as targeting, objective, or structure) will not be made immediately. This is to allow the algorithm to stabilize and collect accurate performance data. However, minor optimizations (such as budget adjustments or performance-based tweaks) may be done if required.</p>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 mb-2">2. Creative Testing Policy</h4>
                <p className="text-sm text-gray-700">If any changes are required in creatives (videos, images, ad copy), new ads will be created instead of editing existing ones. This helps maintain data consistency and allows proper A/B testing.</p>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 mb-2">3. Performance Expectations</h4>
                <p className="text-sm text-gray-700">Ads do not guarantee instant results. Performance depends on multiple factors such as market competition, target audience behavior, and product or service pricing. For higher-priced products or services (above ₹5000), conversion cycles are generally longer, and leads may take time to convert into paying customers.</p>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 mb-2">4. Learning Phase and Optimization</h4>
                <p className="text-sm text-gray-700">Every campaign goes through an initial learning phase where the system tests different audiences and placements. During this phase, results may fluctuate and cost per lead may be higher initially. Proper optimization decisions are taken only after sufficient data is collected.</p>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 mb-2">5. Budget Responsibility</h4>
                <p className="text-sm text-gray-700">Ad performance is directly affected by budget consistency. Any sudden increase or decrease in budget from the client's side may disrupt campaign performance and reset optimization progress. The team managing the ad account should coordinate before making any budget changes.</p>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 mb-2">6. Lead Management Responsibility</h4>
                <p className="text-sm text-gray-700">Ad success also depends on how quickly and effectively leads are handled. Delays in response or poor communication can reduce conversion rates significantly.</p>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 mb-2">7. Reporting Policy</h4>
                <p className="text-sm text-gray-700">Reports will be shared based on the agreed schedule: Every 3 days / Weekly / Custom timeline. Reports will include key metrics such as reach, leads, cost per lead, and overall performance insights.</p>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 mb-2">8. No Guaranteed Results Policy</h4>
                <p className="text-sm text-gray-700">While best strategies and optimizations will be applied, results cannot be guaranteed as they depend on external factors such as market demand, competition, and customer behavior.</p>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 mb-2">9. Communication and Approvals</h4>
                <p className="text-sm text-gray-700">All creatives, copies, and campaign strategies will be shared for approval before going live. Timely approvals are necessary to avoid delays in campaign launch.</p>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 mb-2">10. Testing and Scaling Approach</h4>
                <p className="text-sm text-gray-700">Initial campaigns are focused on testing and data collection. Once a winning strategy is identified, budget scaling will be recommended and high-performing creatives will be prioritized.</p>
              </div>
            </div>

            {/* Scroll Progress Indicator */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-amber-900">Scroll Progress:</span>
                <span className="text-sm font-semibold text-amber-900">{guidelinesScrollProgress}% {guidelinesFullyScrolled ? '✓ Fully Read' : ''}</span>
              </div>
              <div className="w-full bg-amber-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${guidelinesFullyScrolled ? 'bg-green-500' : 'bg-amber-500'}`}
                  style={{ width: `${guidelinesScrollProgress}%` }}
                />
              </div>
            </div>

            {/* Acknowledgement Checkbox */}
            <div className="flex items-center space-x-3">
              <Checkbox
                id="guidelines"
                checked={guidelinesRead}
                onCheckedChange={(checked) => setGuidelinesRead(checked as boolean)}
                disabled={!guidelinesFullyScrolled}
              />
              <label 
                htmlFor="guidelines" 
                className={`text-sm cursor-pointer ${guidelinesFullyScrolled ? 'text-gray-700' : 'text-gray-400'}`}
              >
                I have read and understood all campaign guidelines
              </label>
            </div>
          </Card>

          {/* Terms and Conditions */}
          <Card className="p-8 shadow-lg bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Terms & Conditions</h3>
            <div className="bg-white p-4 rounded-lg mb-4 max-h-48 overflow-y-auto border border-gray-200">
              <p className="text-sm text-gray-700 leading-relaxed">
                By submitting this form, you acknowledge that:
              </p>
              <ul className="text-sm text-gray-700 mt-3 space-y-2 list-disc list-inside">
                <li>All information provided is accurate and complete to the best of your knowledge.</li>
                <li>You have the authority to provide the information and credentials shared in this form.</li>
                <li>You authorize us to use the provided information for Meta Ads campaign management.</li>
                <li>You understand that campaign results depend on various factors including market conditions, audience targeting, and creative quality.</li>
                <li>You agree to maintain the confidentiality of login credentials and not share them with unauthorized parties.</li>
                <li>You consent to receive communications regarding your campaign performance and updates.</li>
              </ul>
            </div>
            <div className="flex items-center space-x-3">
              <Checkbox
                id="terms"
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
              />
              <label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer">
                I accept the terms and conditions and confirm that all information provided is accurate
              </label>
            </div>
          </Card>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={!termsAccepted || !guidelinesRead || !guidelinesFullyScrolled || submitMutation.isPending}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold"
            >
              {submitMutation.isPending ? 'Submitting...' : 'Submit Form'}
            </Button>
            <Button
              type="button"
              onClick={() => {
                setFormData(initialFormData);
                setTermsAccepted(false);
                setGuidelinesRead(false);
                setGuidelinesFullyScrolled(false);
              }}
              variant="outline"
              className="flex-1"
            >
              Reset
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
