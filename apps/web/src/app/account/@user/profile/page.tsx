"use client";

import {
  changeUserEmail,
  deleteUser,
  updateUserDetails,
} from "@/features/profile/actions/get-user-detail";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertTriangle,
  ArrowLeft,
  Camera,
  Loader2,
  Lock,
  Mail,
  Save,
  ShieldCheck,
  Trash2,
  Upload,
  User,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [isResendingVerification, setIsResendingVerification] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    email: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        image: session.user.image || "",
        email: session.user.email || "",
      });
    }
  }, [session]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      await updateUserDetails({
        name: formData.name,
        image: formData.image,
        email: formData.email,
      });
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChangingEmail(true);

    try {
      await changeUserEmail({ email: formData.email });
      toast.success("Email change request sent! Please check your inbox.");
    } catch (error) {
      toast.error("Failed to send email change request. Please try again.");
    } finally {
      setIsChangingEmail(false);
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setIsUploadingImage(true);

    try {
      // Convert to base64 for preview (you might want to upload to a service like Cloudinary)
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setFormData((prev) => ({
          ...prev,
          image: imageUrl,
        }));
        toast.success("Image uploaded successfully!");
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!showDeleteConfirmation) {
      setShowDeleteConfirmation(true);
      return;
    }

    setIsDeleting(true);

    try {
      await deleteUser();
      toast.success("Account deleted successfully!");
      // Redirect to homepage or login page after deletion
      window.location.href = "/";
    } catch (error) {
      toast.error("Failed to delete account. Please try again.");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirmation(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePasswordInputChange = (field: string, value: string) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleResendVerification = async () => {
    setIsResendingVerification(true);
    try {
      await authClient.emailOtp.sendVerificationOtp({
        email: formData.email,
        type: "email-verification",
      });
      toast.success("Verification code sent! Please check your inbox.");
    } catch (error) {
      toast.error("Failed to send verification code. Please try again.");
    } finally {
      setIsResendingVerification(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setIsChangingPassword(true);
    try {
      await authClient.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        revokeOtherSessions: true,
      });
      toast.success("Password updated successfully!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: any) {
      toast.error(error.message || "Failed to update password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="w-fit h-8 px-2 -ml-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">
              Profile Settings
            </h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences.
            </p>
          </div>
        </div>

        {/* Profile Picture Section */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Camera className="w-5 h-5 text-primary" />
              Profile Picture
            </CardTitle>
            <CardDescription>
              Upload a new avatar to personalize your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="w-24 h-24 border-4 border-primary/20">
                  <AvatarImage src={formData.image} className="object-cover" />
                  <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-primary/20 to-primary/10">
                    {formData.name
                      ? formData.name.charAt(0).toUpperCase()
                      : "U"}
                  </AvatarFallback>
                </Avatar>
                {isUploadingImage && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  </div>
                )}
              </div>
              <div className="space-y-3 flex-1">
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="image" className="text-sm font-medium">
                      Profile Picture
                    </Label>
                    <div className="mt-2 flex gap-3">
                      <div className="relative">
                        <input
                          type="file"
                          id="imageUpload"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            document.getElementById("imageUpload")?.click()
                          }
                          disabled={isUploadingImage}
                          loading={isUploadingImage}
                          icon={!isUploadingImage && <Upload className="w-4 h-4" />}
                          className="flex items-center gap-2"
                        >
                          Upload Image
                        </Button>
                      </div>
                      <div className="flex-1">
                        <Input
                          id="image"
                          type="url"
                          placeholder="Or paste image URL"
                          value={formData.image}
                          onChange={(e) =>
                            handleInputChange("image", e.target.value)
                          }
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Upload an image from your device or paste a URL. Maximum
                    file size: 5MB.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Information */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <User className="w-5 h-5 text-primary" />
              Profile Information
            </CardTitle>
            <CardDescription>
              Update your personal information and display name.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Display Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your display name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
                <p className="text-xs text-muted-foreground">
                  This is the name that will be displayed to other users.
                </p>
              </div>

              <Button
                type="submit"
                disabled={isUpdating || !formData.name}
                loading={isUpdating}
                icon={!isUpdating && <Save className="w-4 h-4 mr-2" />}
                className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-200"
              >
                Update Profile
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Email Settings */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Mail className="w-5 h-5 text-primary" />
              Email Settings
            </CardTitle>
            <CardDescription>
              Manage your email address and verification status.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-muted/50">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Current Email</p>
                  <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  {session?.user?.emailVerified ? (
                    <Badge className="bg-green-500/10 text-green-600 border-green-500/20 flex gap-1 items-center">
                      <ShieldCheck className="w-3 h-3" />
                      Verified
                    </Badge>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-amber-600 border-amber-500/20 bg-amber-500/5">
                        Not Verified
                      </Badge>
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        disabled={isResendingVerification}
                        loading={isResendingVerification}
                        onClick={handleResendVerification}
                        className="h-7 text-xs"
                      >
                        Verify Now
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <form onSubmit={handleChangeEmail} className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Change Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter new email address"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                  <p className="text-xs text-muted-foreground">
                    A verification code will be sent to your new email address.
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isChangingEmail || !formData.email || formData.email === session?.user?.email}
                  loading={isChangingEmail}
                  icon={!isChangingEmail && <Save className="w-4 h-4 mr-2" />}
                  variant="outline"
                  className="w-full sm:w-auto border-primary/20 hover:bg-primary/5 transition-all duration-200"
                >
                  Update Email
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>

        {/* Security / Password Settings */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Lock className="w-5 h-5 text-primary" />
              Security Settings
            </CardTitle>
            <CardDescription>
              Update your password to keep your account secure.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => handlePasswordInputChange("currentPassword", e.target.value)}
                    placeholder="Your current password"
                    className="focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div />
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => handlePasswordInputChange("newPassword", e.target.value)}
                    placeholder="Minimal 8 characters"
                    className="focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => handlePasswordInputChange("confirmPassword", e.target.value)}
                    placeholder="Confirm new password"
                    className="focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isChangingPassword || !passwordData.currentPassword || !passwordData.newPassword}
                  loading={isChangingPassword}
                  className="w-full sm:w-auto bg-primary hover:bg-primary/90"
                >
                  Update Password
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Danger Zone - Delete Account */}
        <Card className="border-0 shadow-lg border-red-200">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl text-red-600">
              <Trash2 className="w-5 h-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>
              Permanently delete your account and all associated data.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-red-900">
                    Warning: This action cannot be undone
                  </h4>
                  <p className="text-sm text-red-700">
                    Deleting your account will permanently remove all your data,
                    including:
                  </p>
                  <ul className="text-sm text-red-700 list-disc list-inside space-y-1 ml-4">
                    <li>Profile information and settings</li>
                    <li>Booking history and reservations</li>
                    <li>Reviews and ratings</li>
                    <li>Saved properties and preferences</li>
                  </ul>
                </div>
              </div>
            </div>

            {!showDeleteConfirmation ? (
              <Button
                onClick={handleDeleteAccount}
                variant="destructive"
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 transition-all duration-200"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-red-900 mb-2">
                    Are you absolutely sure you want to delete your account?
                  </p>
                  <p className="text-sm text-red-700">
                    Type "DELETE" below to confirm this action:
                  </p>
                </div>
                <div className="flex gap-3">
                    <Button
                      onClick={handleDeleteAccount}
                      disabled={isDeleting}
                      loading={isDeleting}
                      variant="destructive"
                      icon={!isDeleting && <Trash2 className="w-4 h-4 mr-2" />}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Yes, Delete My Account
                    </Button>
                  <Button
                    onClick={() => setShowDeleteConfirmation(false)}
                    variant="outline"
                    disabled={isDeleting}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Note */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Mail className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-blue-900">
                Security Notice
              </h4>
              <p className="text-sm text-blue-700">
                For your security, any changes to your email address will
                require verification. You'll receive a confirmation link at your
                new email address.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
