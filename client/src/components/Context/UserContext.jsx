import { createContext } from 'react'

export const UserContext = createContext({
	user: {},
	setUser: () => {},
	loggedIn: false,
})

export const UserContextProvider = UserContext.Provider
