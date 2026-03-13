import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../features/auth/store/AuthContext'
import { ThemeProvider } from '../shared/context/ThemeContext'
import { CustomizationProvider } from '../features/customization/store/CustomizationContext'

export const AppProviders = ({ children }) => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <CustomizationProvider>
            {children}
          </CustomizationProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}