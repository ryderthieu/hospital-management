import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import { useState } from "react";
import { Link } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
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
                <p className="text-sm text-gray-500">
                  Đăng nhập để truy cập
                </p>
              </div>
              <div>
                <form>
                  <div className="space-y-6">
                    <div>
                      <Label>
                        Tên đăng nhập <span className="text-error-500">*</span>{" "}
                      </Label>
                      <Input placeholder="info@gmail.com" />
                    </div>
                    <div>
                      <Label>
                        Mật khẩu <span className="text-error-500">*</span>{" "}
                      </Label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
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
                      <Button className="w-full" size="sm">
                        Đăng nhập
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
