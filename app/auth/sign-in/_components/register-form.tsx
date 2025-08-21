import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { boolean, z } from "zod"

import FormContainer from '@/components/forms/form-container'
import FormInput from "@/components/forms/input"
import { useLoading } from '@/components/providers/loading-provider'
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { TabsContent } from "@/components/ui/tabs"
import { Key, Mail, MailIcon, PhoneCallIcon } from "lucide-react"
import { registerSchema } from '../_schema'
import { onRegisterSubmit } from "../_submit/register"
import { Label } from "@radix-ui/react-label"
import { Checkbox } from "@/components/ui/checkbox"
import GoogleSignIn from "./google-signin"

type Schema = z.infer<typeof registerSchema>

const RegisterForm = () => {
    const { setIsLoading, setLoadingMessage } = useLoading();

    const form = useForm<Schema>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: "",
            agree: false
        },
    })

    const onSubmit = async (values: Schema) => {
        try {
            setIsLoading(true)
            setLoadingMessage("Please wait while we register your account!");
            await onRegisterSubmit(values);
            form.reset()
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <TabsContent value="register" className="space-y-4">
            <div className="space-y-4">
                <GoogleSignIn />
            </div>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-slate-500">Or create account with email</span>
                </div>
            </div>

            <FormContainer
                form={form}
                onSubmit={onSubmit}
            >
                <div className="grid grid-cols-2 gap-4">
                    <FormInput
                        form={form}
                        name="firstName"
                        label="First Name"
                        placeholder="Enter your first name"
                        type="text"
                    />
                    <FormInput
                        form={form}
                        name="lastName"
                        label="Last Name"
                        placeholder="Enter your last name"
                        type="text"
                    />
                </div>
                <FormInput
                    form={form}
                    name="email"
                    label="Email Address"
                    placeholder="Enter your email address"
                    type="email"
                    leftIcon={<MailIcon className="size-4" />}
                />
                <FormInput
                    form={form}
                    name="phone"
                    label="Contact Number"
                    placeholder="Enter your phone details"
                    type="tel"
                    leftIcon={<PhoneCallIcon className="size-4" />}
                />
                <FormInput
                    form={form}
                    name="password"
                    label="Password"
                    placeholder="Enter your password"
                    type="password"
                    leftIcon={<Key className="size-4" />}
                />
                <FormInput
                    form={form}
                    name="confirmPassword"
                    label="Confirm Password"
                    placeholder="Confirm your password"
                    type="password"
                    leftIcon={<Key className="size-4" />}
                />
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="terms"
                        checked={form.watch("agree")}
                        onCheckedChange={(checked) => form.setValue("agree", checked === true)}
                    />
                    <Label htmlFor="terms" className="text-sm text-slate-600">
                        I agree to the{" "}
                        <Button variant="link" className="px-0 h-auto text-sm">
                            Terms of Service
                        </Button>{" "}
                        and{" "}
                        <Button variant="link" className="px-0 h-auto text-sm">
                            Privacy Policy
                        </Button>
                    </Label>
                </div>
                {form.formState.errors.agree && (
                    <p className="text-xs text-red-400">*{form.formState.errors.agree.message}</p>
                )}
                <Button type="submit" className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Create Account
                </Button>
            </FormContainer>
        </TabsContent>
    )
}

export default RegisterForm