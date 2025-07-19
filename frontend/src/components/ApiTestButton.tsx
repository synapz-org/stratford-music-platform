import React, { useState } from 'react'
import { apiClient } from '@/utils/api'
import toast from 'react-hot-toast'

const ApiTestButton: React.FC = () => {
    const [testing, setTesting] = useState(false)

    const testApiConnection = async () => {
        setTesting(true)
        console.log('Testing API connection...')
        
        try {
            // Test basic connectivity
            const healthResponse = await fetch('https://stratford-music-platform-production.up.railway.app/api/health')
            console.log('Health check response:', {
                status: healthResponse.status,
                statusText: healthResponse.statusText,
                headers: Object.fromEntries(healthResponse.headers.entries())
            })
            
            if (healthResponse.ok) {
                const data = await healthResponse.json()
                console.log('Health check data:', data)
                toast.success('✅ Backend is reachable!')
                
                // Test CORS by making a request with our API client
                try {
                    await apiClient.get('/health')
                    toast.success('✅ CORS is working!')
                } catch (corsError) {
                    console.error('CORS test failed:', corsError)
                    toast.error('❌ CORS issue detected - check console for details')
                }
                
                // Test registration endpoint specifically
                try {
                    const testRegResponse = await fetch('https://stratford-music-platform-production.up.railway.app/api/auth/register', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            email: 'test-' + Date.now() + '@example.com',
                            password: 'test123',
                            name: 'Test User',
                            role: 'READER'
                        })
                    })
                    
                    console.log('Registration test response:', {
                        status: testRegResponse.status,
                        statusText: testRegResponse.statusText,
                        headers: Object.fromEntries(testRegResponse.headers.entries())
                    })
                    
                    if (testRegResponse.ok) {
                        const regData = await testRegResponse.json()
                        console.log('Registration test successful:', regData)
                        toast.success('✅ Registration endpoint working!')
                    } else {
                        const errorData = await testRegResponse.text()
                        console.error('Registration test failed:', errorData)
                        toast.error(`❌ Registration endpoint returned ${testRegResponse.status}`)
                    }
                } catch (regError) {
                    console.error('Registration endpoint test failed:', regError)
                    toast.error('❌ Registration endpoint unreachable')
                }
            } else {
                toast.error(`❌ Backend returned ${healthResponse.status}`)
            }
        } catch (error) {
            console.error('API test failed:', error)
            toast.error('❌ Cannot reach backend - check console for details')
        } finally {
            setTesting(false)
        }
    }

    return (
        <button
            onClick={testApiConnection}
            disabled={testing}
            className="btn-outline mb-4"
        >
            {testing ? 'Testing API...' : 'Test API Connection'}
        </button>
    )
}

export default ApiTestButton
