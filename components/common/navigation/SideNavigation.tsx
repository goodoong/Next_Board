"use client";

import { Button, Input } from "@/components/ui";
import { Search } from "lucide-react";
import { useCreateTask } from "@/app/hooks/apis";

function SideNavigation() {
  const handleCreateTask = useCreateTask();

  return (
    <div className="flex flex-col w-[280px] h-screen py-[20px] px-[24px] gap-2 border-x-[1px] border-[#e6e6e6]">
      {/* 검색창 */}
      <div className="flex items-center justify-start gap-[4px]">
        <Input
          type="text"
          placeholder="검색어를 입력해주세요"
          className="focust-visible:ring-0"
        />
        <Button variant={"outline"} size="icon">
          <Search className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex items-center justify-center w-full margin-y-[12px]">
        <Button
          variant={"outline"}
          onClick={handleCreateTask}
          className="w-full text-emerald-500 border-emerald-400 hover:bg-emerald-50 hover:text-emerald-600"
        >
          Add New Page
        </Button>
      </div>
      <div className="flex flex-col mt-4 gap-2">
        <small className="text-sm font-medium leading-none text-[#a6a6a6]">
          <span className="text-neutral-700">고동 님</span>의 TASK
        </small>
        <div className="flex flex-col">
          {/* supabase에서 우리가 생성한 DB에 데이터가 없을 경우 */}
          <li className="bg-[#f5f5f5] min-h-9 flex items-center gap-2 py-2 px-[10px] rounded-sm text-sm text-neutral-400">
            <div className="h-[6px] w-[6px] rounded-full bg-neutral-400"></div>
            등록된 Task가 없습니다.
          </li>
        </div>
      </div>
    </div>
  );
}

export default SideNavigation;
