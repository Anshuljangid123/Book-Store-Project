'use client'

import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { useAuth } from '@clerk/nextjs'
import { useEffect } from 'react'
import api from '@/lib/api'

function AxiosInterceptor({ children }: { children: React.ReactNode }) {
  const { getToken } = useAuth();
  
  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(async (config) => {
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config;
    })

    return () => {
      api.interceptors.request.eject(requestInterceptor);
    }
  }, [getToken])

  return <>{children}</>
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider value={defaultSystem}>
      <AxiosInterceptor>
        {children}
      </AxiosInterceptor>
    </ChakraProvider>
  )
}
