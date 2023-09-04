'use client';

import { User } from "@prisma/client";
import Image from "next/image";
import useActiveList from "../hooks/useActiveList";
import getCurrentUser from "../actions/getCurrentUser";
import { useSession } from "next-auth/react";

interface AvatarGroupProps {
  users?: User[];
};

const AvatarGroup: React.FC<AvatarGroupProps> = ({ 
  users = [],
}) => {

  const slicedUsers = users.slice(0, 3);
  const { members } = useActiveList();
  const session = useSession();
  

  const isActive = (userEmail: string) => {
    return members.indexOf(userEmail) !== -1 && userEmail !== session?.data?.user?.email;
  };

  
  const positionMap = {
    0: 'top-0 left-[12px]',
    1: 'bottom-0',
    2: 'bottom-0 right-0'
  };

  return (
    <div className="relative h-11 w-11">
      {slicedUsers.map((user, index) => (
        <div 
          key={user.id} 
          className={`
            absolute
            inline-block 
            rounded-full 
            overflow-hidden
            h-[21px]
            w-[21px]
            ${positionMap[index as keyof typeof positionMap]}
          `}>
            <Image
              fill
              src={user?.image || '/images/avatar.png'}
              alt="Avatar"
            />
        </div>
          
      ))}
      {users.some((user) => isActive(user.email!)) && (
          <span 
          className="
              absolute
              block
              rounded-full
              bg-green-500
              ring-2
              ring-white
              top-0
              right-0
              h-2
              w-2
              md:h-3
              md:w-3"
      />
      )}
    </div>
  );
}

export default AvatarGroup;