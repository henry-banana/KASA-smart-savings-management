import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Sparkles, MapPinOff, ArrowLeft, Home } from 'lucide-react';
import { CuteEmptyState, CuteBadge, StarDecor } from '../../components/CuteComponents';

export default function NotFound() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGoHome = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role === 'admin') {
      navigate('/regulations');
    } else {
      navigate('/dashboard');
    }
  };

  const handleGoBack = () => {
    // Quay lại trang trước, nếu stack không có thì về home
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      handleGoHome();
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="overflow-hidden border-0 shadow-xl rounded-3xl">
        {/* Header với gradient + sparkle giống style KASA */}
        <CardHeader className="relative bg-linear-to-r from-[#E8F6FF] via-[#DFF9F4] to-[#FFF7D6] border-b border-gray-100">
          <div className="absolute top-0 right-0 w-40 h-40 -mt-16 -mr-16 rounded-full bg-white/50 opacity-60" />
          <StarDecor className="top-4 right-6" />
          <div className="relative z-10 flex items-center justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Sparkles className="text-cyan-500" size={20} />
                Oops! Trang không tồn tại
              </CardTitle>
              <CardDescription className="mt-1 text-sm">
                Có vẻ như bạn đã đi lạc khỏi KASA rồi ✨
              </CardDescription>
            </div>
            <div className="hidden sm:block">
              <CuteBadge variant="info" className="shadow-sm">
                404 • Lost in Savings
              </CuteBadge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 sm:p-8">
          <CuteEmptyState
            icon="piggy"
            title="Không tìm thấy trang bạn yêu cầu"
            description="Đường dẫn này có thể đã được đổi, bị xoá, hoặc bạn gõ nhầm. Đừng lo, bạn vẫn có thể quay lại các khu vực an toàn trong hệ thống KASA."
            action={
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Button
                  onClick={handleGoHome}
                  className="h-11 px-6 rounded-full text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                  style={{ background: 'linear-gradient(135deg, #1A4D8F 0%, #00AEEF 100%)' }}
                >
                  <Home size={18} className="mr-2" />
                  Về trang chính
                </Button>
                <Button
                  variant="outline"
                  onClick={handleGoBack}
                  className="flex items-center gap-2 px-6 text-gray-700 border-gray-200 rounded-full h-11 hover:bg-gray-50"
                >
                  <ArrowLeft size={18} />
                  Quay lại
                </Button>
              </div>
            }
          />

          {/* Hint nhỏ bên dưới */}
          <div className="flex flex-col items-center gap-1 mt-8 text-xs text-center text-gray-500">
            <MapPinOff size={16} className="text-gray-400" />
            <p>
              URL hiện tại: <span className="font-mono text-[11px] break-all text-gray-600">{window.location.pathname}</span>
            </p>
            {user && (
              <p>
                Bạn đang đăng nhập với vai trò{' '}
                <span className="font-semibold">
                  {user.role === 'admin'
                    ? 'Administrator'
                    : user.role === 'accountant'
                    ? 'Accountant'
                    : 'Teller'}
                </span>
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
