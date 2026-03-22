import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../features/auth/store/AuthContext'
import { ThemeProvider } from '../shared/context/ThemeContext'
import { CustomizationProvider } from '../features/customization/store/CustomizationContext'
import { FeedbackProvider } from '../shared/context/FeedbackContext'

export const AppProviders = ({ children }) => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <FeedbackProvider>
          <AuthProvider>
            <CustomizationProvider>
              {children}
            </CustomizationProvider>
          </AuthProvider>
        </FeedbackProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

