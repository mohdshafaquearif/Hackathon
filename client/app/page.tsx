"use client"

import { useState, useEffect } from "react"
import {
  Search,
  ChevronDown,
  Edit,
  Plus,
  X,
  Calendar,
  Linkedin,
  Twitter,
  Instagram,
  Home,
  MessageSquare,
  Users,
  Bell,
  Menu,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { getMe, updateProfile } from "@/lib/api"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface UserProfile {
  firstName: string
  lastName: string
  email: string
  age?: number
  gender?: string
  address?: {
    line1?: string
    line2?: string
    city?: string
    state?: string
    pincode?: string
    country?: string
  }
  phone?: string
  bio?: string
  preferredLanguages?: string[]
  interestedTopics?: string[]
  socialMedia?: {
    linkedin?: string
    twitter?: string
    instagram?: string
    facebook?: string
    youtube?: string
  }
  education?: Array<{
    _id?: string
    degree: string
    college: string
    fieldOfStudy: string
    startDate: Date
    endDate?: Date
  }>
  workExperience?: Array<{
    _id?: string
    jobTitle: string
    company: string
    startDate: Date
    endDate?: Date
    employmentType: string
    industry: string
    location: string
  }>
}

interface ApiResponse {
  success: boolean
  user: UserProfile
}

export default function ProfilePage() {
  const [activeModal, setActiveModal] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"profile" | "education" | "workExperience" | "paymentMethods" | "securityPrivacy" | "settings">("profile")
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const [personalForm, setPersonalForm] = useState<Partial<UserProfile>>({
    firstName: '',
    lastName: '',
    email: '',
    age: undefined,
    gender: undefined,
    address: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      pincode: '',
      country: ''
    }
  })

  const [bioForm, setBioForm] = useState('')
  const [languagesForm, setLanguagesForm] = useState<string[]>([])
  const [topicsForm, setTopicsForm] = useState<string[]>([])
  const [socialMediaForm, setSocialMediaForm] = useState<NonNullable<UserProfile['socialMedia']>>({
    linkedin: '',
    twitter: '',
    instagram: '',
    facebook: '',
    youtube: ''
  })

  const [educationForm, setEducationForm] = useState({
    degree: '',
    college: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: ''
  })

  const [workExperienceForm, setWorkExperienceForm] = useState({
    jobTitle: '',
    company: '',
    startDate: '',
    endDate: '',
    employmentType: '',
    industry: '',
    location: ''
  })

  const [selectedEducation, setSelectedEducation] = useState<NonNullable<NonNullable<UserProfile>['education']>[0] | null>(null)
  const [selectedWorkExperience, setSelectedWorkExperience] = useState<NonNullable<NonNullable<UserProfile>['workExperience']>[0] | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    fetchProfile()
  }, [router])

  const fetchProfile = async () => {
    try {
      const response = await getMe() as ApiResponse
      setProfile(response.user)
      setPersonalForm(response.user)
      setBioForm(response.user.bio || '')
      setLanguagesForm(response.user.preferredLanguages || [])
      setTopicsForm(response.user.interestedTopics || [])
      setSocialMediaForm(response.user.socialMedia || {
        linkedin: '',
        twitter: '',
        instagram: '',
        facebook: '',
        youtube: ''
      })
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch profile')
      if (error.response?.status === 401) {
        router.push('/login')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const closeModal = () => setActiveModal(null)

  const handleUpdateProfile = async (updatedData: Partial<UserProfile>) => {
    try {
      await updateProfile(updatedData)
      await fetchProfile()
      toast.success('Profile updated successfully')
      closeModal()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    }
  }

  const handleEducationChange = (field: string, value: string) => {
    setEducationForm(prev => ({ ...prev, [field]: value }))
  }

  const handleWorkExperienceChange = (field: string, value: string) => {
    setWorkExperienceForm(prev => ({ ...prev, [field]: value }))
  }

  const handleAddEducation = async () => {
    try {
      const formattedData = {
        ...educationForm,
        startDate: new Date(educationForm.startDate),
        endDate: educationForm.endDate ? new Date(educationForm.endDate) : undefined
      }
      await updateProfile({
        education: [...(profile?.education || []), formattedData]
      })
      await fetchProfile()
      toast.success('Education added successfully')
      closeModal()
      setEducationForm({
        degree: '',
        college: '',
        fieldOfStudy: '',
        startDate: '',
        endDate: ''
      })
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add education')
    }
  }

  const handleAddWorkExperience = async () => {
    try {
      const formattedData = {
        ...workExperienceForm,
        startDate: new Date(workExperienceForm.startDate),
        endDate: workExperienceForm.endDate ? new Date(workExperienceForm.endDate) : undefined
      }
      await updateProfile({
        workExperience: [...(profile?.workExperience || []), formattedData]
      })
      await fetchProfile()
      toast.success('Work experience added successfully')
      closeModal()
      setWorkExperienceForm({
        jobTitle: '',
        company: '',
        startDate: '',
        endDate: '',
        employmentType: '',
        industry: '',
        location: ''
      })
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add work experience')
    }
  }

  const handleEditEducation = async () => {
    if (!selectedEducation?._id || !profile) return

    try {
      const formattedData = {
        degree: educationForm.degree,
        college: educationForm.college,
        fieldOfStudy: educationForm.fieldOfStudy,
        startDate: new Date(educationForm.startDate),
        endDate: educationForm.endDate ? new Date(educationForm.endDate) : undefined
      }
      await updateProfile({
        education: profile?.education?.map(edu =>
          edu._id === selectedEducation._id ? formattedData : edu
        )
      })
      await fetchProfile()
      toast.success('Education updated successfully')
      closeModal()
      setSelectedEducation(null)
      setEducationForm({
        degree: '',
        college: '',
        fieldOfStudy: '',
        startDate: '',
        endDate: ''
      })
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update education')
    }
  }

  const handleEditWorkExperience = async () => {
    if (!selectedWorkExperience?._id || !profile) return

    try {
      const formattedData = {
        jobTitle: workExperienceForm.jobTitle,
        company: workExperienceForm.company,
        startDate: new Date(workExperienceForm.startDate),
        endDate: workExperienceForm.endDate ? new Date(workExperienceForm.endDate) : undefined,
        employmentType: workExperienceForm.employmentType,
        industry: workExperienceForm.industry,
        location: workExperienceForm.location
      }
      await updateProfile({
        workExperience: profile?.workExperience?.map(exp =>
          exp._id === selectedWorkExperience._id ? formattedData : exp
        )
      })
      await fetchProfile()
      toast.success('Work experience updated successfully')
      closeModal()
      setSelectedWorkExperience(null)
      setWorkExperienceForm({
        jobTitle: '',
        company: '',
        startDate: '',
        endDate: '',
        employmentType: '',
        industry: '',
        location: ''
      })
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update work experience')
    }
  }

  const handleDeleteEducation = async (id: string) => {
    try {
      await updateProfile({
        education: profile?.education?.filter(edu => edu._id !== id)
      })
      await fetchProfile()
      toast.success('Education deleted successfully')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete education')
    }
  }

  const handleDeleteWorkExperience = async (id: string) => {
    try {
      await updateProfile({
        workExperience: profile?.workExperience?.filter(exp => exp._id !== id)
      })
      await fetchProfile()
      toast.success('Work experience deleted successfully')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete work experience')
    }
  }

  const handleLanguageToggle = (language: string) => {
    setLanguagesForm(prev => {
      if (prev.includes(language)) {
        return prev.filter(l => l !== language)
      } else {
        return [...prev, language]
      }
    })
  }

  const handleTopicToggle = (topic: string) => {
    setTopicsForm(prev => {
      if (prev.includes(topic)) {
        return prev.filter(t => t !== topic)
      } else {
        return [...prev, topic]
      }
    })
  }

  const handleSocialMediaChange = (platform: keyof NonNullable<UserProfile['socialMedia']>, value: string) => {
    setSocialMediaForm(prev => ({
      ...prev,
      [platform]: value
    }))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white p-4 flex items-center justify-between border-b">
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-medium text-gray-700">SimpliTrain</h1>

          <div className="relative hidden md:block">
            <button className="flex items-center gap-2 text-gray-500">
              Categories <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="relative flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              className="pl-10 pr-4 py-2 w-full bg-gray-100 border-0"
              placeholder="What would you like to learn?"
            />
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <Link href="#" className="flex flex-col items-center text-xs text-gray-500">
            <Home className="h-5 w-5 mb-1" />
            Home
          </Link>
          <Link href="#" className="flex flex-col items-center text-xs text-gray-500">
            <Menu className="h-5 w-5 mb-1" />
            Categories
          </Link>
          <Link href="#" className="flex flex-col items-center text-xs text-gray-500">
            <MessageSquare className="h-5 w-5 mb-1" />
            Chat
          </Link>
          <Link href="#" className="flex flex-col items-center text-xs text-gray-500">
            <Users className="h-5 w-5 mb-1" />
            Forum
          </Link>
          <Link href="#" className="flex flex-col items-center text-xs text-gray-500">
            <Bell className="h-5 w-5 mb-1" />
            Notification
          </Link>
        </div>
        <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
      </header>

      <main className="p-4 md:p-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-[250px,1fr] gap-6">
          {/* Sidebar */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col items-center mb-6">
              <div className="relative mb-2">
                <div className="h-24 w-24 bg-gray-200 rounded-full flex items-center justify-center mb-2 relative">
                  <button className="absolute bottom-1 right-1 bg-white p-1 rounded-full border">
                    <Edit className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
                <h2 className="text-center font-medium">{profile?.firstName} {profile?.lastName}</h2>
              </div>

              <nav className="w-full mt-6 space-y-2">
                <button
                  className={`w-full text-left py-2 px-4 rounded-md ${activeTab === "profile" ? "bg-gray-100 font-medium" : "text-gray-500 hover:bg-gray-50"}`}
                  onClick={() => setActiveTab("profile")}
                >
                  Profile
                </button>
                <button
                  className={`w-full text-left py-2 px-4 rounded-md ${activeTab === "education" ? "bg-gray-100 font-medium" : "text-gray-500 hover:bg-gray-50"}`}
                  onClick={() => setActiveTab("education")}
                >
                  Education
                </button>
                <button
                  className={`w-full text-left py-2 px-4 rounded-md ${activeTab === "workExperience" ? "bg-gray-100 font-medium" : "text-gray-500 hover:bg-gray-50"}`}
                  onClick={() => setActiveTab("workExperience")}
                >
                  Work Experience
                </button>
                <button
                  className={`w-full text-left py-2 px-4 rounded-md ${activeTab === "paymentMethods" ? "bg-gray-100 font-medium" : "text-gray-500 hover:bg-gray-50"}`}
                  onClick={() => setActiveTab("paymentMethods")}
                >
                  Payment Methods
                </button>
                <button
                  className={`w-full text-left py-2 px-4 rounded-md ${activeTab === "securityPrivacy" ? "bg-gray-100 font-medium" : "text-gray-500 hover:bg-gray-50"}`}
                  onClick={() => setActiveTab("securityPrivacy")}
                >
                  Security & Privacy
                </button>
                <button
                  className={`w-full text-left py-2 px-4 rounded-md ${activeTab === "settings" ? "bg-gray-100 font-medium" : "text-gray-500 hover:bg-gray-50"}`}
                  onClick={() => setActiveTab("settings")}
                >
                  Settings
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            {activeTab === "profile" && (
              <>
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-medium">Profile</h2>
                    <button className="p-1 rounded-md hover:bg-gray-100">
                      <Edit className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>

                  {/* Personal Information */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium">Personal Information</h3>
                      <button
                        className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                        onClick={() => setActiveModal("editPersonal")}
                      >
                        Edit <Edit className="h-3 w-3" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-y-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase">FIRST NAME</p>
                        <p>{profile?.firstName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">LAST NAME</p>
                        <p>{profile?.lastName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">AGE</p>
                        <p>{profile?.age || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">GENDER</p>
                        <p>{profile?.gender || 'Not specified'}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs text-gray-500 uppercase">ADDRESS</p>
                        <p>
                          {profile?.address ? (
                            `${profile.address.line1 || ''} ${profile.address.line2 || ''}, 
                             ${profile.address.city || ''}, ${profile.address.state || ''} 
                             ${profile.address.pincode || ''}, ${profile.address.country || ''}`
                          ) : (
                            'Not specified'
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium mb-4">Contact Information</h3>
                    <div className="grid grid-cols-2 gap-y-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase">EMAIL</p>
                        <p>{profile?.email}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">PHONE NUMBER</p>
                        <p>{profile?.phone || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium">Bio</h3>
                      <button
                        className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                        onClick={() => setActiveModal("editBio")}
                      >
                        Edit <Edit className="h-3 w-3" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-700">
                      {profile?.bio || 'No bio added yet.'}
                    </p>
                  </div>

                  {/* Preferred Language */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium">Preferred Language</h3>
                      <button
                        className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                        onClick={() => setActiveModal("editLanguage")}
                      >
                        Edit <Edit className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="flex gap-2">
                      {profile?.preferredLanguages?.map((language, index) => (
                        <Badge key={index} variant="outline" className="px-3 py-1 rounded-full">
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Interested Topic */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium">Interested Topic</h3>
                      <button
                        className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                        onClick={() => setActiveModal("editTopic")}
                      >
                        Edit <Edit className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {topicsForm.map((topic, index) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className="px-3 py-1 rounded-full bg-gray-200 flex items-center gap-1"
                        >
                          {topic} 
                          <button onClick={() => handleTopicToggle(topic)}>
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Social Media */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium">Social Media</h3>
                      <button
                        className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                        onClick={() => setActiveModal("addSocialMedia")}
                      >
                        Edit <Edit className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="flex gap-4">
                      {socialMediaForm.linkedin && (
                        <a href={socialMediaForm.linkedin} target="_blank" rel="noopener noreferrer">
                          <Linkedin className="h-6 w-6 text-blue-600" />
                        </a>
                      )}
                      {socialMediaForm.twitter && (
                        <a href={socialMediaForm.twitter} target="_blank" rel="noopener noreferrer">
                          <Twitter className="h-6 w-6 text-black" />
                        </a>
                      )}
                      {socialMediaForm.instagram && (
                        <a href={socialMediaForm.instagram} target="_blank" rel="noopener noreferrer">
                          <div className="h-6 w-6 rounded-full bg-red-500 flex items-center justify-center">
                            <Instagram className="h-4 w-4 text-white" />
                          </div>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Education Section */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-medium">Education</h2>
                    <Button
                      variant="secondary"
                      className="bg-gray-800 text-white hover:bg-gray-700 rounded-md"
                      onClick={() => setActiveModal("addEducation")}
                    >
                      ADD
                    </Button>
                  </div>

                  <div className="space-y-6">
                    {profile?.education?.map((education, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="h-12 w-12 bg-gray-100 rounded-md"></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">{education.degree} at {education.college}</h3>
                            <div className="flex items-center gap-2">
                              <button
                                className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                                onClick={() => {
                                  setSelectedEducation(education)
                                  setEducationForm({
                                    degree: education.degree,
                                    college: education.college,
                                    fieldOfStudy: education.fieldOfStudy,
                                    startDate: new Date(education.startDate).toISOString().split('T')[0],
                                    endDate: education.endDate ? new Date(education.endDate).toISOString().split('T')[0] : ''
                                  })
                                  setActiveModal("editEducation")
                                }}
                              >
                                Edit <Edit className="h-3 w-3" />
                              </button>
                              <button
                                className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1"
                                onClick={() => education._id && handleDeleteEducation(education._id)}
                              >
                                Delete <X className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">{education.fieldOfStudy}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(education.startDate).toLocaleDateString()} - {education.endDate ? new Date(education.endDate).toLocaleDateString() : 'Present'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Work Experience Section */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-medium">Work Experience</h2>
                    <Button
                      variant="secondary"
                      className="bg-gray-800 text-white hover:bg-gray-700 rounded-md"
                      onClick={() => setActiveModal("addWorkExperience")}
                    >
                      ADD
                    </Button>
                  </div>

                  <div className="space-y-6">
                    {profile?.workExperience?.map((experience, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="h-12 w-12 bg-gray-100 rounded-md"></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">{experience.jobTitle} at {experience.company}</h3>
                            <div className="flex items-center gap-2">
                              <button
                                className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                                onClick={() => {
                                  setSelectedWorkExperience(experience)
                                  setWorkExperienceForm({
                                    jobTitle: experience.jobTitle,
                                    company: experience.company,
                                    startDate: new Date(experience.startDate).toISOString().split('T')[0],
                                    endDate: experience.endDate ? new Date(experience.endDate).toISOString().split('T')[0] : '',
                                    employmentType: experience.employmentType,
                                    industry: experience.industry,
                                    location: experience.location
                                  })
                                  setActiveModal("editWorkExperience")
                                }}
                              >
                                Edit <Edit className="h-3 w-3" />
                              </button>
                              <button
                                className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1"
                                onClick={() => experience._id && handleDeleteWorkExperience(experience._id)}
                              >
                                Delete <X className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">{experience.industry} • {experience.employmentType}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(experience.startDate).toLocaleDateString()} - {experience.endDate ? new Date(experience.endDate).toLocaleDateString() : 'Present'}
                          </p>
                          <p className="text-xs text-gray-500">{experience.location}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
{activeTab === "education" && (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-medium">Education</h2>
      <Button
        variant="secondary"
        className="bg-gray-800 text-white hover:bg-gray-700 rounded-md"
        onClick={() => setActiveModal("addEducation")}
      >
        ADD
      </Button>
    </div>

    <div className="space-y-6">
      {profile?.education?.map((education, index) => (
        <div key={index} className="flex gap-4">
          {/* Placeholder for an Icon or Logo */}
          <div className="h-12 w-12 bg-gray-100 rounded-md"></div>

          <div className="flex-1 overflow-hidden">
            <div className="flex items-center justify-between flex-wrap">
              {/* Degree and College Name */}
              <h3 className="font-medium break-words truncate w-full sm:w-auto">
                {education.degree} at {education.college}
              </h3>

              {/* Edit Button */}
              <button
                className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                onClick={() => setActiveModal("editEducation")}
              >
                Edit <Edit className="h-3 w-3" />
              </button>
            </div>

            {/* Field of Study */}
            <p className="text-sm text-gray-600 break-words">{education.fieldOfStudy}</p>

            {/* Start and End Dates */}
            <p className="text-xs text-gray-500">
              {new Date(education.startDate).toLocaleDateString()} -{" "}
              {education.endDate ? new Date(education.endDate).toLocaleDateString() : "Present"}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
)}


            {activeTab === "workExperience" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-medium">Work Experience</h2>
                  <Button
                    variant="secondary"
                    className="bg-gray-800 text-white hover:bg-gray-700 rounded-md"
                    onClick={() => setActiveModal("addWorkExperience")}
                  >
                    ADD
                  </Button>
                </div>

                <div className="space-y-6">
                  {profile?.workExperience?.map((experience, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="h-12 w-12 bg-gray-100 rounded-md">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{experience.jobTitle} at {experience.company}</h3>
                          <button
                            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                            onClick={() => setActiveModal("editWorkExperience")}
                          >
                            Edit <Edit className="h-3 w-3" />
                          </button>
                        </div>
                        <p className="text-sm text-gray-600">{experience.industry}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(experience.startDate).toLocaleDateString()} - {experience.endDate ? new Date(experience.endDate).toLocaleDateString() : 'Present'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "paymentMethods" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-medium mb-6">Payment Methods</h2>
                <p className="text-gray-500">No payment methods added yet.</p>
              </div>
            )}

            {activeTab === "securityPrivacy" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-medium mb-6">Security & Privacy</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">Password</h3>
                    <Button variant="outline">Change Password</Button>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Two-Factor Authentication</h3>
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-6 bg-gray-200 rounded-full relative">
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                      </div>
                      <span className="text-sm text-gray-500">Off</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Privacy Settings</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Show my profile to other users</span>
                        <div className="w-12 h-6 bg-gray-800 rounded-full relative">
                          <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Email notifications</span>
                        <div className="w-12 h-6 bg-gray-800 rounded-full relative">
                          <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-medium mb-6">Settings</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">Theme</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" className="bg-white">
                        Light
                      </Button>
                      <Button variant="outline">Dark</Button>
                      <Button variant="outline">System</Button>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Language</h3>
                    <Select defaultValue="en">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="hi">Hindi</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Account</h3>
                    <Button variant="destructive">Delete Account</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      {/* Edit Personal Information Modal */}
      <Dialog open={activeModal === "editPersonal"} onOpenChange={() => closeModal()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Edit Personal Information</DialogTitle>
              <button onClick={closeModal}>
                <X className="h-4 w-4" />
              </button>
            </div>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">FIRST NAME</p>
              <Input 
                value={personalForm.firstName} 
                onChange={(e) => setPersonalForm(prev => ({ ...prev, firstName: e.target.value }))}
              />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">LAST NAME</p>
              <Input 
                value={personalForm.lastName}
                onChange={(e) => setPersonalForm(prev => ({ ...prev, lastName: e.target.value }))}
              />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">EMAIL</p>
              <Input 
                value={personalForm.email}
                onChange={(e) => setPersonalForm(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div>
              <p className="text-xs mb-1">Gender</p>
              <Select 
                value={personalForm.gender} 
                onValueChange={(value) => setPersonalForm(prev => ({ ...prev, gender: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className="text-xs mb-1">AGE</p>
              <div className="flex items-center">
                <Input 
                  type="number" 
                  value={personalForm.age || ''}
                  onChange={(e) => setPersonalForm(prev => ({ ...prev, age: parseInt(e.target.value) || undefined }))}
                />
              </div>
            </div>
            <div>
              <p className="text-xs mb-1">Address line 1</p>
              <Input 
                value={personalForm.address?.line1 || ''}
                onChange={(e) => setPersonalForm(prev => ({ 
                  ...prev, 
                  address: { ...prev.address, line1: e.target.value }
                }))}
              />
            </div>
            <div>
              <p className="text-xs mb-1">Address line 2</p>
              <Input 
                value={personalForm.address?.line2 || ''}
                onChange={(e) => setPersonalForm(prev => ({ 
                  ...prev, 
                  address: { ...prev.address, line2: e.target.value }
                }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs mb-1">City</p>
                <Input 
                  value={personalForm.address?.city || ''}
                  onChange={(e) => setPersonalForm(prev => ({ 
                    ...prev, 
                    address: { ...prev.address, city: e.target.value }
                  }))}
                />
              </div>
              <div>
                <p className="text-xs mb-1">State</p>
                <Select 
                  value={personalForm.address?.state || ''} 
                  onValueChange={(value) => setPersonalForm(prev => ({ 
                    ...prev, 
                    address: { ...prev.address, state: value }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="karnataka">Karnataka</SelectItem>
                    <SelectItem value="tamilnadu">Tamil Nadu</SelectItem>
                    <SelectItem value="kerala">Kerala</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs mb-1">Pincode</p>
                <Input 
                  value={personalForm.address?.pincode || ''}
                  onChange={(e) => setPersonalForm(prev => ({ 
                    ...prev, 
                    address: { ...prev.address, pincode: e.target.value }
                  }))}
                />
              </div>
              <div>
                <p className="text-xs mb-1">Country</p>
                <Select 
                  value={personalForm.address?.country || ''} 
                  onValueChange={(value) => setPersonalForm(prev => ({ 
                    ...prev, 
                    address: { ...prev.address, country: value }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="india">India</SelectItem>
                    <SelectItem value="usa">USA</SelectItem>
                    <SelectItem value="uk">UK</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <Button 
            className="w-full bg-gray-800 text-white hover:bg-gray-700" 
            onClick={() => handleUpdateProfile(personalForm)}
          >
            SAVE
          </Button>
        </DialogContent>
      </Dialog>

      {/* Edit Bio Modal */}
      <Dialog open={activeModal === "editBio"} onOpenChange={() => closeModal()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Edit Bio</DialogTitle>
              <button onClick={closeModal}>
                <X className="h-4 w-4" />
              </button>
            </div>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              className="min-h-[150px]"
              value={bioForm}
              onChange={(e) => setBioForm(e.target.value)}
            />
          </div>
          <Button 
            className="w-full bg-gray-800 text-white hover:bg-gray-700" 
            onClick={() => handleUpdateProfile({ bio: bioForm })}
          >
            SAVE
          </Button>
        </DialogContent>
      </Dialog>

      {/* Edit Language Modal */}
      <Dialog open={activeModal === "editLanguage"} onOpenChange={() => closeModal()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Preferred Language</DialogTitle>
              <button onClick={closeModal}>
                <X className="h-4 w-4" />
              </button>
            </div>
          </DialogHeader>
          <div className="py-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input className="pl-10" placeholder="Search language" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="english" 
                  checked={languagesForm.includes('english')}
                  onCheckedChange={() => handleLanguageToggle('english')}
                />
                <label htmlFor="english">English</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="spanish" 
                  checked={languagesForm.includes('spanish')}
                  onCheckedChange={() => handleLanguageToggle('spanish')}
                />
                <label htmlFor="spanish">Spanish</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="arabic" 
                  checked={languagesForm.includes('arabic')}
                  onCheckedChange={() => handleLanguageToggle('arabic')}
                />
                <label htmlFor="arabic">Arabic</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="tamil" 
                  checked={languagesForm.includes('tamil')}
                  onCheckedChange={() => handleLanguageToggle('tamil')}
                />
                <label htmlFor="tamil">Tamil</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="hindi" 
                  checked={languagesForm.includes('hindi')}
                  onCheckedChange={() => handleLanguageToggle('hindi')}
                />
                <label htmlFor="hindi">Hindi</label>
              </div>
            </div>
          </div>
          <Button 
            className="w-full bg-gray-800 text-white hover:bg-gray-700" 
            onClick={() => handleUpdateProfile({ preferredLanguages: languagesForm })}
          >
            SAVE
          </Button>
        </DialogContent>
      </Dialog>

      {/* Add Social Media Modal */}
      <Dialog open={activeModal === "addSocialMedia"} onOpenChange={() => closeModal()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Add Social Media Link</DialogTitle>
              <button onClick={closeModal}>
                <X className="h-4 w-4" />
              </button>
            </div>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Input 
                placeholder="LinkedIn Link" 
                value={socialMediaForm.linkedin}
                onChange={(e) => handleSocialMediaChange('linkedin', e.target.value)}
              />
            </div>
            <div>
              <Input 
                placeholder="Instagram Link"
                value={socialMediaForm.instagram}
                onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
              />
            </div>
            <div>
              <Input 
                placeholder="Facebook Link"
                value={socialMediaForm.facebook}
                onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
              />
            </div>
            <div>
              <Input 
                placeholder="X Link"
                value={socialMediaForm.twitter}
                onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
              />
            </div>
            <div>
              <Input 
                placeholder="YouTube Link"
                value={socialMediaForm.youtube}
                onChange={(e) => handleSocialMediaChange('youtube', e.target.value)}
              />
            </div>
          </div>
          <Button 
            className="w-full bg-gray-800 text-white hover:bg-gray-700" 
            onClick={() => handleUpdateProfile({ socialMedia: socialMediaForm })}
          >
            SAVE
          </Button>
        </DialogContent>
      </Dialog>

      {/* Edit Social Media Modal */}
      <Dialog open={activeModal === "editSocialMedia"} onOpenChange={() => closeModal()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Edit Social Media Link</DialogTitle>
              <button onClick={closeModal}>
                <X className="h-4 w-4" />
              </button>
            </div>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">LINKEDIN</p>
              <Input defaultValue={profile?.socialMedia?.linkedin} />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">INSTAGRAM</p>
              <Input defaultValue={profile?.socialMedia?.instagram} />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">FACEBOOK</p>
              <Input defaultValue={profile?.socialMedia?.facebook} />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">X</p>
              <Input defaultValue={profile?.socialMedia?.twitter} />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">YOUTUBE</p>
              <Input defaultValue={profile?.socialMedia?.youtube} />
            </div>
            <div className="flex items-center">
              <Input placeholder="Add New Link" />
              <button className="ml-2 bg-gray-100 rounded-full p-1">
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </div>
          <Button className="w-full bg-gray-800 text-white hover:bg-gray-700" onClick={() => handleUpdateProfile({
            socialMedia: {
              linkedin: profile?.socialMedia?.linkedin,
              twitter: profile?.socialMedia?.twitter,
              instagram: profile?.socialMedia?.instagram,
              facebook: profile?.socialMedia?.facebook,
              youtube: profile?.socialMedia?.youtube
            }
          })}>SAVE</Button>
        </DialogContent>
      </Dialog>

      {/* Edit Topic Modal */}
      <Dialog open={activeModal === "editTopic"} onOpenChange={() => closeModal()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Interested Topic</DialogTitle>
              <button onClick={closeModal}>
                <X className="h-4 w-4" />
              </button>
            </div>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm mb-4">Tag (maximum 20)</p>
            <div className="flex flex-wrap gap-2 mb-8">
              {topicsForm.map((topic, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="px-3 py-1 rounded-full bg-gray-200 flex items-center gap-1"
                >
                  {topic} 
                  <button onClick={() => handleTopicToggle(topic)}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>

            <p className="text-sm mb-4">Suggested</p>
            <div className="flex flex-wrap gap-2">
              {[
                'Design',
                'Marketing',
                'Sales',
                'Finance',
                'Dance',
                'Business'
              ].filter(topic => !topicsForm.includes(topic)).map((topic, index) => (
                <Badge 
                  key={index}
                  variant="outline" 
                  className="px-3 py-1 rounded-full flex items-center gap-1 cursor-pointer"
                  onClick={() => handleTopicToggle(topic)}
                >
                  <Plus className="h-3 w-3" /> {topic}
                </Badge>
              ))}
            </div>
          </div>
          <Button 
            className="w-full bg-gray-800 text-white hover:bg-gray-700" 
            onClick={() => handleUpdateProfile({ interestedTopics: topicsForm })}
          >
            SAVE
          </Button>
        </DialogContent>
      </Dialog>

      {/* Add Education Modal */}
      <Dialog open={activeModal === "addEducation"} onOpenChange={() => closeModal()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Add Education</DialogTitle>
              <button onClick={closeModal}>
                <X className="h-4 w-4" />
              </button>
            </div>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Select value={educationForm.degree} onValueChange={(value) => handleEducationChange('degree', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select degree" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bachelors">Bachelor's</SelectItem>
                  <SelectItem value="masters">Master's</SelectItem>
                  <SelectItem value="phd">PhD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Input 
                placeholder="College" 
                value={educationForm.college}
                onChange={(e) => handleEducationChange('college', e.target.value)}
              />
            </div>
            <div>
              <Input 
                placeholder="Field of study" 
                value={educationForm.fieldOfStudy}
                onChange={(e) => handleEducationChange('fieldOfStudy', e.target.value)}
              />
            </div>
            <div className="relative">
              <Input 
                type="date"
                placeholder="Start Date" 
                value={educationForm.startDate}
                onChange={(e) => handleEducationChange('startDate', e.target.value)}
              />
            </div>
            <div className="relative">
              <Input 
                type="date"
                placeholder="End Date" 
                value={educationForm.endDate}
                onChange={(e) => handleEducationChange('endDate', e.target.value)}
              />
            </div>
          </div>
          <Button 
            className="w-full bg-gray-800 text-white hover:bg-gray-700" 
            onClick={handleAddEducation}
          >
            ADD
          </Button>
        </DialogContent>
      </Dialog>

      {/* Edit Education Modal */}
      <Dialog open={activeModal === "editEducation"} onOpenChange={() => closeModal()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Edit Education</DialogTitle>
              <button onClick={closeModal}>
                <X className="h-4 w-4" />
              </button>
            </div>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">DEGREE</p>
              <Select defaultValue="bachelors">
                <SelectTrigger>
                  <SelectValue placeholder="Select degree" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bachelors">Bachelors</SelectItem>
                  <SelectItem value="masters">Masters</SelectItem>
                  <SelectItem value="phd">PhD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">COLLEGE</p>
              <Input defaultValue="Christ University" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">FIELD OF STUDY</p>
              <Input defaultValue="Business" />
            </div>
            <div className="relative">
              <p className="text-xs text-gray-500 uppercase mb-1">START DATE</p>
              <div className="relative">
                <Input defaultValue="07/12/2020" />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
            </div>
            <div className="relative">
              <p className="text-xs text-gray-500 uppercase mb-1">END DATE</p>
              <div className="relative">
                <Input defaultValue="01/05/2024" />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
            </div>
          </div>
          <Button 
            className="w-full bg-gray-800 text-white hover:bg-gray-700" 
            onClick={handleEditEducation}
          >
            SAVE
          </Button>
        </DialogContent>
      </Dialog>

      {/* Add Work Experience Modal */}
      <Dialog open={activeModal === "addWorkExperience"} onOpenChange={() => closeModal()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Add Work Experience</DialogTitle>
              <button onClick={closeModal}>
                <X className="h-4 w-4" />
              </button>
            </div>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Input 
                placeholder="Job Title"
                value={workExperienceForm.jobTitle}
                onChange={(e) => handleWorkExperienceChange('jobTitle', e.target.value)}
              />
            </div>
            <div>
              <Input 
                placeholder="Company Name"
                value={workExperienceForm.company}
                onChange={(e) => handleWorkExperienceChange('company', e.target.value)}
              />
            </div>
            <div className="relative">
              <Input 
                type="date"
                placeholder="Start Date"
                value={workExperienceForm.startDate}
                onChange={(e) => handleWorkExperienceChange('startDate', e.target.value)}
              />
            </div>
            <div className="relative">
              <Input 
                type="date"
                placeholder="End Date"
                value={workExperienceForm.endDate}
                onChange={(e) => handleWorkExperienceChange('endDate', e.target.value)}
              />
            </div>
            <div>
              <Select value={workExperienceForm.employmentType} onValueChange={(value) => handleWorkExperienceChange('employmentType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Employment Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full Time</SelectItem>
                  <SelectItem value="part-time">Part Time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={workExperienceForm.industry} onValueChange={(value) => handleWorkExperienceChange('industry', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Input 
                placeholder="Location"
                value={workExperienceForm.location}
                onChange={(e) => handleWorkExperienceChange('location', e.target.value)}
              />
            </div>
          </div>
          <Button 
            className="w-full bg-gray-800 text-white hover:bg-gray-700" 
            onClick={handleAddWorkExperience}
          >
            ADD
          </Button>
        </DialogContent>
      </Dialog>

      {/* Edit Work Experience Modal */}
      <Dialog open={activeModal === "editWorkExperience"} onOpenChange={() => closeModal()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Edit Work Experience</DialogTitle>
              <button onClick={closeModal}>
                <X className="h-4 w-4" />
              </button>
            </div>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">JOB TITLE</p>
              <Input defaultValue="Designer" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">COMPANY NAME</p>
              <Input defaultValue="Christ University" />
            </div>
            <div className="relative">
              <p className="text-xs text-gray-500 uppercase mb-1">START DATE</p>
              <div className="relative">
                <Input defaultValue="07/12/2020" />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
            </div>
            <div className="relative">
              <p className="text-xs text-gray-500 uppercase mb-1">END DATE</p>
              <div className="relative">
                <Input defaultValue="01/05/2024" />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">EMPLOYMENT TYPE</p>
              <Input defaultValue="Full Time" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">INDUSTRY</p>
              <Select defaultValue="it">
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="it">Information Technology</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">LOCATION/CITY</p>
              <Input defaultValue="Bengaluru" />
            </div>
          </div>
          <Button 
            className="w-full bg-gray-800 text-white hover:bg-gray-700" 
            onClick={handleEditWorkExperience}
          >
            SAVE
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}

