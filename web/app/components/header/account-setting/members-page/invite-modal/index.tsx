'use client'
import { Fragment, useCallback, useMemo, useState } from 'react'
import { useContext } from 'use-context-selector'
import { useTranslation } from 'react-i18next'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/20/solid'
import cn from 'classnames'
import { Modal as AModal, Input } from 'antd'

import { debounce, findIndex } from 'lodash-es'
import s from './index.module.css'

// import Button from '@/app/components/base/button'
import { getUserName, inviteMember } from '@/service/common'
import { ToastContext } from '@/app/components/base/toast'
import type { InvitationResult } from '@/models/common'
import I18n from '@/context/i18n'
import { useAppContext } from '@/context/app-context'
import 'react-multi-email/dist/style.css'

const { TextArea } = Input
type IInviteModalProps = {
  onCancel: () => void
  onSend: (invitationResults: InvitationResult[]) => void
}

const InviteModal = ({
  onCancel,
  onSend,
}: IInviteModalProps) => {
  const { t } = useTranslation()
  const [emails, setEmails] = useState<string[]>([])
  const { notify } = useContext(ToastContext)

  const { locale } = useContext(I18n)

  const InvitingRoles = useMemo(() => [
    {
      name: 'normal',
      description: t('common.members.normalTip'),
    },
    {
      name: 'admin',
      description: t('common.members.adminTip'),
    },
  ], [t])
  const [role, setRole] = useState(InvitingRoles[0])

  const [modalVisible] = useState(true)

  const { isCurrentWorkspaceManager } = useAppContext()

  // 搜索成员
  const [memberList, setMemberList] = useState<any[]>([])
  const searchMembers = debounce(async (e: any) => {
    console.log(e?.target?.value, '进行了搜索')
    const id = e?.target?.value
    const res: any = await getUserName(id)
    console.log(res, '搜索结果')
    setMemberList(res.result || [])
  }, 500)

  const [memberObj, setMemberObj] = useState<any>({})
  const [checkedMember, setCheckedMember] = useState<any[]>([])
  const setMember = (member: any) => {
    const { username } = member
    // console.log(e.target.value)
    setMemberObj({ ...memberObj, [username]: !memberObj[username] })
    if (!memberObj[username]) {
      checkedMember.unshift(member)
    }
    else {
      const index = findIndex(checkedMember, item => item.username === username)
      checkedMember.splice(index, 1)
    }
    console.log(memberObj, 'yoghurt')
  }

  const [account, setAccount] = useState('')

  // 发送邀请
  const handleSend = useCallback(async () => {
    console.log('邀请人员角色', role)
    const accountArr = Array.from(new Set(account.replaceAll('，', ',').replaceAll(/\s/g, '').split(',').filter(item => item)))
    console.log('邀请人员列表', account, accountArr)

    if (accountArr.length) {
      try {
        const { result } = await inviteMember({
          url: '/workspaces/current/members/invite-job-number',
          body: { jobNumbers: accountArr, role: role.name, language: locale },
        })
        if (result === 'success') {
          onCancel()
          onSend(accountArr)
        }
      }
      catch (e) {}
    }
    else {
      notify({ type: 'error', message: t('common.members.jobNumberErr') })
    }
  }, [role, emails, notify, onCancel, onSend, t, account])

  return (
    <div className={cn(s.wrap)}>
      <AModal title={t('common.members.inviteTeamMember')} open={modalVisible} onCancel={onCancel} onOk={handleSend} width="500px">
        {/* <div className="add-content overflow-hidden h-[400px] w-full rounded-md border border-slate-300 flex">
          <div className="select-member flex-1 flex flex-col p-[10px] border-r">
            <Input placeholder="请输入用户名或工号" prefix={<SearchOutlined />} onChange={searchMembers}/>
            <div className="member-list overflow-y-auto flex-1 self-scroll mt-[5px]">
              {memberList.map(member =>
                <div className="member-item flex items-center h-[60px] px-2 border-b" key={member.username}>
                  <Checkbox checked={memberObj[member.username]} onChange={setMember.bind(null, member)}></Checkbox>
                  <div className="member-msg ml-4">
                    <div>{member.fullname}</div>
                    <div>{member.username}</div>
                  </div>
                </div>,
              )}
            </div>
          </div>
          <div className='p-[10px] flex-1 flex flex-col'>
            <div className='pt-[8px]'>已选：{checkedMember.length}人</div>
            <div className="member flex-1 overflow-y-auto self-scroll">
              {
                checkedMember.map(member =>
                  <div className="member-item flex items-center h-[60px] mx-2 border-b" key={member.username}>
                    <div className="member-msg ml-2 flex-1">
                      <div>{member.fullname}</div>
                      <div>{member.username}</div>
                    </div>
                    <CloseOutlined className="cursor-pointer text-xs" onClick={setMember.bind(null, member)} />
                  </div>,
                )
              }
            </div>
          </div>
        </div> */}
        <div className="add-content overflow-hidden w-full rounded-md flex flex-col">
          <div className='pt-[10px] mb-[10px]'>对方在登录后可以访问你的团队数据</div>
          <TextArea rows={6} placeholder='输入工号,之间以","分割,全角/半角都支持。' onChange={e => setAccount(e.target.value)}/>
        </div>
        <Listbox value={role} onChange={setRole}>
          <div className="relative mt-4">
            <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-gray-100 outline-none border-none appearance-none text-sm text-gray-900 rounded-lg">
              <span className="block truncate capitalize">{t('common.members.invitedAsRole', { role: t(`common.members.${role.name}`) })}</span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-200"
              leaveFrom="opacity-200"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-50 w-full py-1 my-2 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {InvitingRoles.map(role =>
                  <Listbox.Option
                    key={role.name}
                    className={({ active }) =>
                      `${active ? ' bg-gray-50 rounded-xl' : ' bg-transparent'}
                          cursor-default select-none relative py-2 px-4 mx-2 flex flex-col`
                    }
                    value={role}
                  >
                    {({ selected }) => (
                      <div className='flex flex-row'>
                        <span
                          className={cn(
                            'text-indigo-600 w-8',
                            'flex items-center',
                          )}
                        >
                          {selected && (<CheckIcon className="h-5 w-5" aria-hidden="true" />)}
                        </span>
                        <div className=' flex flex-col flex-grow'>
                          <span className={`${selected ? 'font-medium' : 'font-normal'} capitalize block truncate`}>
                            {t(`common.members.${role.name}`)}
                          </span>
                          <span className={`${selected ? 'font-medium' : 'font-normal'} capitalize block truncate`}>
                            {role.description}
                          </span>
                        </div>
                      </div>
                    )}
                  </Listbox.Option>,
                )}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      </AModal>
    </div>
  )
}

export default InviteModal
