"use client";

import { Button, Input } from "@/components/ui";
import { Search } from "lucide-react";
import { useGetTasks, useCreateTask, useSearch } from "@/hooks/apis";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Task } from "@/types";
import { useRouter } from "next/navigation";

function SideNavigation() {
  const { id } = useParams();
  const router = useRouter();
  const search = useSearch();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { tasks, getTasks } = useGetTasks();
  const handleCreateTask = useCreateTask();

  const handleSearchTermChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      //useSearch 훅이 동작하도록 한다.
      search(searchTerm);
    }
  };

  //getTasks는 컴포넌트 최초 렌더링 시 한번만 호출되어야하므로 useEffect로 호출
  useEffect(() => {
    getTasks();
  }, [id]);

  return (
    <aside className="page__aside">
      <div className="flex flex-col h-full gap-3">
        {/* 검색창 */}
        <div className="flex items-center justify-start gap-[4px]">
          <Input
            type="text"
            placeholder="검색어를 입력해주세요"
            className="focus-visible:ring-0"
            onChange={handleSearchTermChange}
            onKeyDown={handleSearch}
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
          <ul className="flex flex-col">
            {tasks.length === 0 ? (
              <li className="bg-[#f5f5f5] min-h-9 flex items-center gap-2 py-2 px-[10px] rounded-sm text-sm text-neutral-400">
                {/* supabase에서 우리가 생성한 DB에 데이터가 없을 경우 */}
                <div className="h-[6px] w-[6px] rounded-full bg-neutral-400"></div>
                등록된 Task가 없습니다.
              </li>
            ) : (
              tasks.map((task: Task) => {
                return (
                  <li
                    key={task.id}
                    onClick={() => router.push(`/task/${task.id}`)}
                    className={`${
                      task.id === Number(id) && "bg-[#f5f5f5]"
                    } min-h-9 flex items-center gap-2 py-2 px-[10px] rounded-s text-sm cursor-pointer"}`}
                  >
                    <div
                      className={`${
                        task.id === Number(id)
                          ? "bg-[#00f38d]"
                          : "bg-neutral-400"
                      } h-[6px] w-[6px] rounded-full`}
                    ></div>
                    <span
                      className={`${
                        task.id !== Number(id) && `text-neutral-400`
                      }`}
                    >
                      {task.title ? task.title : "등록된 제목이 없습니다."}
                    </span>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      </div>
    </aside>
  );
}

export { SideNavigation };
