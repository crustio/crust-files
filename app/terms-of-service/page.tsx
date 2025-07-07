'use client'

import React from 'react'
import Md from '@/md/terms-of-service.md'
import MDocs from '@/components/root/MDocs'

export default function Page() {
    return <MDocs menus={false} ><Md /></MDocs>
}