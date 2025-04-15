export const __PROD__ = import.meta.env.PROD

const productionBaseUrl = 'https://szlab.xyz/mif/api'
const developmentBaseUrl = 'https://szlab.xyz:9748/mif/api'

export const __BASE_URL__ = __PROD__ ? productionBaseUrl : developmentBaseUrl

export const __API_TIMEOUT__ = 15000
