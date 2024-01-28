import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function LogInComp() {
    return (
      <div className="mx-auto max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Log In</h1>
          <p className="text-gray-500 dark:text-gray-400">Create your account by filling out the form below</p>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name">Name</label>
            <Input id="name" placeholder="Enter your name" required type="text" />
          </div>
          <div className="space-y-2">
            <label htmlFor="email">Email</label>
            <Input id="email" placeholder="Enter your email" required type="email" />
          </div>
          <div className="space-y-2">
            <label htmlFor="password">Password</label>
            <Input id="password" placeholder="Enter your password" required type="password" />
          </div>
          <Button className="w-full" type="submit">
            LogIn
          </Button>
        </div>
      </div>
    )
  }
