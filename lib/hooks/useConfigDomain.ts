import { useEffect } from 'react'

export const DomainRef = {
  value: 'crustfiles.io',
}

export function useConfigDomain() {
  useEffect(() => {
    if (location.hostname !== 'localhost' && location.hostname !== DomainRef.value) {
      DomainRef.value = location.hostname
    }
  }, [])
}
