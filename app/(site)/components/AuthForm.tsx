'use client';

import Button from "@/app/components/Button";
import Input from "@/app/components/inputs/Input";
import { useCallback, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { BsGithub, BsGoogle } from 'react-icons/bs';
import AuthSocialButton from "./AuthSocialButton";
import axios from "axios";
import { toast } from "react-hot-toast";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Variant = 'LOGIN' | 'REGISTER';

const AuthForm = () => {
    const session = useSession();
    const router = useRouter();
    const [variant, setVariant] = useState<Variant>('LOGIN');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (session?.status === 'authenticated') {
            router.push('/users');
        }
    }, [session?.status, router]);

    const toggleVariant = useCallback(() => {
        if (variant === 'LOGIN'){
            setVariant('REGISTER');
        } else {
            setVariant('LOGIN');
        }
    }, [variant]);

    const {
        register,
        handleSubmit,
        formState: {
            errors
        },
        watch,
    } = useForm<FieldValues>({
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        }
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);

        if (variant === 'REGISTER') {
            // Check if passwords match
            if (data.password !== data.confirmPassword) {
                toast.error('Passwords do not match!');
                setIsLoading(false);
                return;
            }
            // Password complexity validation
            const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
            if (!passwordRegex.test(data.password)) {
                toast.error('Password must contain at least 8 characters, including at least one upper letter, one normal letter, one number, and one special character.');
                setIsLoading(false);
                return;
            }

            // Axios Register
            axios.post('/api/register', data)
            .then(() => {
                toast.success('Registered successfully!');
                setVariant('LOGIN');
            })
            .catch(() => 
                toast.error('Something went wrong!')
            )
            .finally(() => setIsLoading(false))
        }

        if (variant === 'LOGIN') {
            // NextAuth SignIn
            signIn('credentials', {
                ...data,
                redirect: false
            })
            .then((callback) => {
                if (callback?.error) {
                    toast.error('Invalid credentials!');
                }
                if (callback?.ok && !callback?.error) {
                    toast.success('Logged in!');
                    router.push('/users');
                }
            })
            .finally(() => setIsLoading(false));
        }
    }

    const socialAction = (action: string) => {
        setIsLoading(true);
        // NextAuth Social SignIn
        signIn(action, { redirect: false })
        .then((callback) => {
            if (callback?.error) {
                toast.error('Invalid credentials!');
            }
            if (callback?.ok && !callback?.error) {
                toast.success('Logged in!');
                router.push('/users');
            }
        })
        .finally(() => setIsLoading(false));
    }

    return (
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
                <form className="space-y-6"
                    onSubmit={handleSubmit(onSubmit)}> 
                    {variant === 'REGISTER' && (
                        <>
                        <Input
                          id="name"
                          label="Name"
                          required
                          register={register}
                          errors={errors}
                          disabled={isLoading}
                        />
                        <Input
                          id="email"
                          label="Email"
                          type="email"
                          required
                          register={register}
                          errors={errors}
                          disabled={isLoading}
                        />
                        <Input
                          id="password"
                          label="Password"
                          type="password"
                          required
                          register={register}
                          errors={errors}
                          disabled={isLoading}
                        />
                        <Input
                          id="confirmPassword"
                          label="Confirm Password"
                          type="password"
                          required
                          register={register}
                          errors={errors}
                          disabled={isLoading}
                        />
                      </>
                    )}
                    {variant === 'LOGIN' && (
                        <>
                        <Input
                          id="email"
                          label="Email"
                          type="email"
                          required
                          register={register}
                          errors={errors}
                          disabled={isLoading}
                        />
                        <Input
                          id="password"
                          label="Password"
                          type="password"
                          required
                          register={register}
                          errors={errors}
                          disabled={isLoading}
                        />
                      </>
                    )}
                    
                    <div>
                        <Button
                            disabled={isLoading}
                            fullWidth
                            type="submit"
                        >
                            {variant  === 'LOGIN' ? 'Sign In' : 'Register'}
                        </Button>
                    </div>
                </form>
                <div className="mt-6">
                    <div className="relative">
                        <div
                            className="
                            absolute
                            inset-0
                            flex
                            items-center"
                        >
                            <div className="
                                w-full 
                                border-t
                                border-gray-300"
                            />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white px-2 text-gray-500">
                                Continue With
                            </span>
                        </div>
                    </div>
                    <div className="mt-6 flex gap-2">
                        <AuthSocialButton 
                            icon={BsGithub}
                            onClick={() => socialAction('github')}
                        />
                        <AuthSocialButton 
                            icon={BsGoogle}
                            onClick={() => socialAction('google')}
                        />
                    </div>

                </div>
                <div className="
                    flex
                    gap-2
                    justify-center
                    text-sm
                    mt-6
                    px-2
                    text-gray-500
                ">
                    <div>
                        {variant === 'LOGIN' ? "New to Rubie's Chat?" : "Already have an account!"}
                    </div>
                    <div
                        onClick={toggleVariant}
                        className="underline cursor-pointer"
                    >
                        {variant === 'LOGIN' ? "Create an account" : 'Login'}
                    </div>
                </div>
            </div>
        </div>

    );
}

export default AuthForm;