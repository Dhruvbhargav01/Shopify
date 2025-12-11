'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase-browser'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.toLowerCase().trim(),
          password,
        })
        if (error) throw error
        router.push('/')
        router.refresh()
      } else {
        const { error } = await supabase.auth.signUp({
          email: email.toLowerCase().trim(),
          password,
          options: {
            data: {
              username: username.trim(),
            },
          },
        })
        if (error) throw error

        setIsLogin(true)
        setEmail('')
        setPassword('')
        setUsername('')
        setError('Account created! Now login with your credentials.')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">Shopify</h1>
          <p className="mt-1 text-sm text-slate-400">
            {isLogin ? 'Sign in to continue' : 'Create a new account'}
          </p>
        </div>

        <Card className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-xl font-semibold">
              {isLogin ? 'Welcome back' : 'Create account'}
            </CardTitle>
            <CardDescription className="text-slate-400 text-sm">
              Enter your details to {isLogin ? 'login' : 'sign up'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="flex rounded-lg bg-slate-900 border border-slate-800 p-1">
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 text-sm font-medium rounded-md ${
                  isLogin
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 text-sm font-medium rounded-md ${
                  !isLogin
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                }`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <Input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-11 bg-slate-900 border-slate-700 text-slate-100 placeholder-slate-500 focus-visible:ring-emerald-500"
                  required
                />
              )}

              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 bg-slate-900 border-slate-700 text-slate-100 placeholder-slate-500 focus-visible:ring-emerald-500"
                required
              />

              <Input
                type="password"
                placeholder={isLogin ? 'Password' : 'Password (6+ characters)'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 bg-slate-900 border-slate-700 text-slate-100 placeholder-slate-500 focus-visible:ring-emerald-500"
                required
                minLength={6}
              />

              {error && (
                <div className="rounded-md bg-red-500/10 border border-red-500/40 px-3 py-2 text-sm text-red-300">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-11 bg-emerald-500 text-slate-950 text-sm font-semibold hover:bg-emerald-400 focus-visible:ring-emerald-400"
                disabled={loading}
              >
                {loading ? 'Processing...' : isLogin ? 'Sign in' : 'Create account'}
              </Button>
            </form>

            <div className="pt-4 border-t border-slate-800 text-center">
              <button
                type="button"
                onClick={() => router.push('/')}
                className="text-xs text-slate-400 hover:text-slate-200"
              >
                Continue as guest
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
