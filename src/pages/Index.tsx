
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, UserCheck, GraduationCap, BarChart3 } from "lucide-react";
import { UserRole } from "@/types";

const Index = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<UserRole | null>(null);

  const handleLogin = async (role: UserRole) => {
    console.log('handleLogin called with role:', role);
    setIsLoading(role);
    
    try {
      // Store role in localStorage
      localStorage.setItem('userRole', role);
      localStorage.setItem('currentUserId', role === 'student' ? 'S001' : role === 'recruiter' ? 'recruiter' : 'admin');
      console.log('localStorage updated:', { userRole: role, currentUserId: role === 'student' ? 'S001' : role === 'recruiter' ? 'recruiter' : 'admin' });
      
      // Navigate to appropriate dashboard immediately
      let targetRoute = '/student/dashboard';
      if (role === 'recruiter') targetRoute = '/recruiter/selection';
      if (role === 'admin') targetRoute = '/admin/panel';
      console.log('Navigating to:', targetRoute);
      navigate(targetRoute);
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-secondary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white/80 backdrop-blur-sm shadow-elegant border-0">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="mx-auto bg-gradient-to-r from-student to-student-secondary p-4 rounded-2xl w-fit">
            <GraduationCap className="h-12 w-12 text-white" />
          </div>
          <div>
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-student to-student-secondary bg-clip-text text-transparent">
              Smart Student Hub
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground mt-2">
              Your comprehensive digital dashboard for academic excellence
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Student Login Card */}
            <Card className="group :shadow-lg transition-all duration-300 :scale-105 cursor-pointer border-student-accent/20 :border-student-accent/40">
              <CardContent className="p-6 text-center space-y-4">
                <div className="mx-auto bg-student-accent p-4 rounded-full w-fit group-:bg-student-secondary transition-colors">
                  <User className="h-8 w-8 text-student" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">Student Portal</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Access your academic dashboard, view achievements, track progress, and generate portfolio
                  </p>
                </div>
                <Button
                  onClick={() => handleLogin('student')}
                  disabled={isLoading !== null}
                  className="w-full bg-student :bg-student/90 text-white"
                  size="lg"
                >
                  {isLoading === 'student' ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Logging in...</span>
                    </div>
                  ) : (
                    <>
                      <User className="mr-2 h-4 w-4" />
                      Login as Student
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Recruiter Login Card */}
            <Card className="group :shadow-lg transition-all duration-300 :scale-105 cursor-pointer border-admin-accent/20 :border-admin-accent/40">
              <CardContent className="p-6 text-center space-y-4">
                <div className="mx-auto bg-admin-accent p-4 rounded-full w-fit group-:bg-admin-secondary transition-colors">
                  <UserCheck className="h-8 w-8 text-admin" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">Recruiter Portal</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Access recruitment tools, skill-based and branch-wise student filtering
                  </p>
                </div>
                <Button
                  onClick={() => handleLogin('recruiter')}
                  disabled={isLoading !== null}
                  className="w-full bg-admin :bg-admin/90 text-white"
                  size="lg"
                >
                  {isLoading === 'recruiter' ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Logging in...</span>
                    </div>
                  ) : (
                    <>
                      <UserCheck className="mr-2 h-4 w-4" />
                      Login as Recruiter
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Admin Login Card */}
            <Card className="group her:shadow-lg transition-all duration-300 her:scale-105 cursor-pointer border-destructive/20 :border-destructive/40">
              <CardContent className="p-6 text-center space-y-4">
                <div className="mx-auto bg-destructive/10 p-4 rounded-full w-fit group-:bg-destructive/20 transition-colors">
                  <UserCheck className="h-8 w-8 text-destructive" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">Admin Portal</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Manage student data, verify achievements, view analytics, and export reports
                  </p>
                </div>
                <Button
                  onClick={() => handleLogin('admin')}
                  disabled={isLoading !== null}
                  className="w-full bg-destructive :bg-destructive/90 text-white"
                  size="lg"
                >
                  {isLoading === 'admin' ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Logging in...</span>
                    </div>
                  ) : (
                    <>
                      <UserCheck className="mr-2 h-4 w-4" />
                      Login as Admin
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Features Preview */}
          <div className="bg-muted/50 rounded-lg p-6 space-y-4">
            <h4 className="font-semibold text-center text-foreground">Platform Features</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="space-y-2">
                <BarChart3 className="h-6 w-6 mx-auto text-student" />
                <p className="text-xs text-muted-foreground">Analytics Dashboard</p>
              </div>
              <div className="space-y-2">
                <GraduationCap className="h-6 w-6 mx-auto text-student" />
                <p className="text-xs text-muted-foreground">Achievement Tracking</p>
              </div>
              <div className="space-y-2">
                <User className="h-6 w-6 mx-auto text-admin" />
                <p className="text-xs text-muted-foreground">Profile Management</p>
              </div>
              <div className="space-y-2">
                <UserCheck className="h-6 w-6 mx-auto text-admin" />
                <p className="text-xs text-muted-foreground">Verification System</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
