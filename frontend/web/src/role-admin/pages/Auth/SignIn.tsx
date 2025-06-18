import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "../../layouts/AuthPageLayout";
import { useState } from "react";
import { EyeCloseIcon, EyeIcon } from "../../components/assets/icons";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import { useLogin } from "../../hooks/useLogin";
import { Link, useNavigate } from "react-router-dom";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const { handleLogin, loading, error } = useLogin();
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleLogin({ phone, password });

    const role = localStorage.getItem("role");
    console.log("Logged in role:", role);

    switch (role) {
      case "ADMIN":
        navigate("/admin");
        break;
      case "RECEPTIONIST":
        navigate("/receptionist");
        break;
      case "DOCTOR":
        navigate("/examination");
        break;
      default:
        navigate("/");
    }
  };

  return (
    <>
      <PageMeta
        title=" SignIn Dashboard | Admin Dashboard"
        description="This is SignIn Tables Dashboard"
      />
      <AuthLayout>
        <div className="flex flex-col flex-1">
          <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
            <div>
              <div className="mb-5 sm:mb-8">
                <h1 className="mb-2 font-semibold text-gray-800 text-title-sm sm:text-title-md">
                  Đăng nhập
                </h1>
                <p className="text-sm text-gray-500">Đăng nhập để truy cập</p>
              </div>
              <div>
                <form onSubmit={onSubmit}>
                  <div className="space-y-6">
                    <div>
                      <Label>
                        Số điện thoại <span className="text-error-500">*</span>{" "}
                      </Label>
                      <Input
                        placeholder="Nhập số điện thoại đã đăng ký"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>
                        Mật khẩu <span className="text-error-500">*</span>{" "}
                      </Label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Nhập mật khẩu"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <span
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                        >
                          {showPassword ? (
                            <EyeIcon className="fill-gray-500 size-5" />
                          ) : (
                            <EyeCloseIcon className="fill-gray-500 size-5" />
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Link
                        to="/reset-password"
                        className="text-sm text-base-500 hover:text-base-600 dark:text-base-400"
                      >
                        Quên mật khẩu
                      </Link>
                    </div>
                    <div>
                      <Button
                        className="w-full"
                        disabled={loading}
                        type="submit"
                      >
                        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </AuthLayout>
    </>
  );
}
