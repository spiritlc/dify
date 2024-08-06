'use client'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useContext } from 'use-context-selector'
import { useTranslation } from 'react-i18next'
import { UserPlusIcon } from '@heroicons/react/24/outline'
import { Input, Modal, Space, Table } from 'antd'
import type { TableProps } from 'antd'
import { DeleteOutlined, ExclamationCircleFilled, FormOutlined, SearchOutlined } from '@ant-design/icons'
import { debounce } from 'lodash-es'
import InviteModal from './invite-modal'
import InvitedModal from './invited-modal'
import EditModal from './edit-modal'
import { deleteMemberOrCancelInvitation, fetchMembers } from '@/service/common'
import I18n from '@/context/i18n'
import { useAppContext } from '@/context/app-context'
import type { InvitationResult } from '@/models/common'
import LogoEmbededChatHeader from '@/app/components/base/logo/logo-embeded-chat-header'
import { useProviderContext } from '@/context/provider-context'
import { Plan } from '@/app/components/billing/type'
import { ToastContext } from '@/app/components/base/toast'

const { confirm } = Modal

dayjs.extend(relativeTime)

const MembersPage = () => {
  const { t } = useTranslation()
  const { notify } = useContext(ToastContext)

  const RoleMap = {
    owner: t('common.members.owner'),
    admin: t('common.members.admin'),
    normal: t('common.members.normal'),
  }
  const { locale } = useContext(I18n)

  const { userProfile, currentWorkspace, isCurrentWorkspaceManager } = useAppContext()
  const { data, mutate } = useSWR({ url: '/workspaces/current/members' }, fetchMembers)
  const [inviteModalVisible, setInviteModalVisible] = useState(false)
  const [invitationResults, setInvitationResults] = useState<InvitationResult[]>([])
  const [invitedModalVisible, setInvitedModalVisible] = useState(false)
  // const accounts = data?.accounts || []
  const [searchCondition, setSearchCondition] = useState('')
  const [accounts, setAccounts] = useState(data?.accounts || [])
  const owner = accounts.filter(account => account.role === 'owner')?.[0]?.email === userProfile.email
  const { plan, enableBilling } = useProviderContext()
  const isNotUnlimitedMemberPlan = enableBilling && plan.type !== Plan.team && plan.type !== Plan.enterprise
  const isMemberFull = enableBilling && isNotUnlimitedMemberPlan && accounts.length >= plan.total.teamMembers

  useEffect(() => {
    console.log('??', searchCondition)
    if (searchCondition)
      setAccounts((data?.accounts || []).filter(item => item.name.includes(searchCondition)))
    else
      setAccounts((data?.accounts || []))
  }, [data, searchCondition])
  // 筛选成员
  const changeSearchCondition = async (val: string) => {
    console.log(val)
    setSearchCondition(val)
    // accounts = ()
  }

  // console.log(currentWorkspace, 'ssfsf')

  // 删除成员
  const handleDeleteMember = (member: any) => {
    confirm({
      title: '提示',
      icon: <ExclamationCircleFilled />,
      content: `是否要删除员工${member.name}?`,
      onOk: async () => {
        console.log('OK')
        console.log(member, '要删除的员工是')
        try {
          await deleteMemberOrCancelInvitation({ url: `/workspaces/current/members/${member.id}` })
          mutate()
          notify({ type: 'success', message: t('common.actionMsg.delSuccessfully') })
        }
        catch (e) {

        }
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }
  // 编辑成员
  const [editVisible, setEditVisible] = useState(false)
  const [editMember, setEditMember] = useState({})
  const handleEditMember = (member: any) => {
    console.log(editVisible, member)
    setEditVisible(true)
    setEditMember(member)
  }
  //
  const columns: TableProps['columns'] = [
    {
      title: t('common.members.jobNumber'),
      dataIndex: 'name',
      key: 'name',
      render: text => <a>{text}</a>,
    },
    {
      title: t('common.members.role'),
      dataIndex: 'role',
      key: 'role',
      render: (text: keyof typeof RoleMap) => <a>{RoleMap[text] || RoleMap.normal}</a>,
    },
  ]
  if (isCurrentWorkspaceManager) {
    columns[2] = {
      title: t('common.members.control'),
      key: 'action',
      width: '180px',
      render: (_, record) => (
        <Space size="middle">
          {record.role !== 'owner' && <FormOutlined className='cursor-pointer' title="编辑" onClick={handleEditMember.bind(null, record)}></FormOutlined>}
          {record.role !== 'owner' && <DeleteOutlined className='cursor-pointer' title="删除" onClick={handleDeleteMember.bind(null, record)}></DeleteOutlined>}
        </Space>
      ),
    }
  }

  return (
    <>
      <div className='flex flex-col'>
        <div className='flex items-center mb-4 p-3 bg-gray-50 rounded-2xl'>
          <LogoEmbededChatHeader className='!w-10 !h-10' />
          <div className='grow mx-2 flex items-center'>
            <div className='text-sm font-medium text-gray-900'>{currentWorkspace?.name}</div>
            <div className={
              `shrink-0 flex ml-4 items-center py-[7px] px-3 border-[0.5px] border-gray-200
            text-[13px] font-medium text-primary-600 bg-white
            shadow-xs rounded-lg ${(isCurrentWorkspaceManager && !isMemberFull) ? 'cursor-pointer' : 'grayscale opacity-50 cursor-default'}`
            } onClick={() => (isCurrentWorkspaceManager && !isMemberFull) && setInviteModalVisible(true)}>
              <UserPlusIcon className='w-4 h-4 mr-2 ' />
              {t('common.members.invite')}
            </div>
          </div>
          <div className="search-block flex items-center">
            <Input onChange={debounce((e) => {
              changeSearchCondition(e.target.value)
            }, 500)} placeholder={t('common.operation.search')!}
            prefix={<SearchOutlined />} allowClear ></Input>
          </div>
        </div>
        <Table columns={columns} dataSource={accounts} rowKey="name"/>
      </div>
      {
        inviteModalVisible && (
          <InviteModal
            onCancel={() => setInviteModalVisible(false)}
            onSend={() => {
              // setInvitedModalVisible(true)
              // setInvitationResults(invitationResults)
              notify({ type: 'success', message: t('common.actionMsg.addSuccessfully') })
              mutate()
            }}
          />
        )
      }
      {
        invitedModalVisible && (
          <InvitedModal
            invitationResults={invitationResults}
            onCancel={() => setInvitedModalVisible(false)}
          />
        )
      }
      {
        editVisible && (
          <EditModal
            member={editMember}
            onCancel={() => setEditVisible(false)}
            onSend={() => {
              notify({ type: 'success', message: t('common.actionMsg.modifiedSuccessfully') })
              mutate()
            }}
          />
        )
      }
    </>
  )
}

export default MembersPage
