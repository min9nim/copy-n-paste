import useBetterMediaQuery from './useBetterMediaQuery'

export default function useIsMobile() {
  return useBetterMediaQuery('only screen and (max-width : 768px)')
}
