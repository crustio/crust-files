
import React from 'react'
import Md from '@/md/privacy-policy.md'
import MDocs from '@/components/root/MDocs'

export default function Page() {
    return <MDocs menus={false} ><Md /></MDocs>
}