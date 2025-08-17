"use client";

import { Button, Input } from "@/components/ui";
import styles from "./SideNavigation.module.scss";
import { Dot, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { sidebarStateAtom } from "@/store";

type Todo = {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  contents: string[];
};

function SideNavigation() {
  const router = useRouter();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [sidebarState, setSidebarState] = useAtom(sidebarStateAtom);
  const onCreate = async () => {
    //supabase 데이터베이스 row 생성
    const { error, status } = await supabase.from("todos").insert([
      {
        title: "",
        start_date: new Date(),
        end_date: new Date(),
        contents: [],
      },
    ]);
    if (error) {
      console.log(error);
    }
    if (status === 201) {
      toast("페이지 생성 완료", {
        description: "새로운 투두리스트가 생성되었습니다.",
      });
      const { data } = await supabase.from("todos").select("*");
      if (data) {
        router.push(`/task/${data[data?.length - 1].id}`);
        getTodos();
      }
    }
  };

  //supabase에 기존에 생성된 페이지가 있는지 없는지 확인
  const getTodos = async () => {
    const {
      data: todos,
      error,
      status,
    } = await supabase.from("todos").select("*");

    setTodos(todos ?? []);
    return todos;
  };
  useEffect(() => {
    getTodos();
  }, [sidebarState]);
  //sidebarState 값이 변할 때마다 getTodos 실행

  return (
    <div className={styles.container}>
      {/* 검색창 */}
      <div className={styles.container__searchBox}>
        <Input
          type="text"
          placeholder="검색어를 입력해주세요"
          className="focust-visible:ring-0"
        />
        <Button variant={"outline"} size="icon">
          <Search className="w-4 h-4" />
        </Button>
      </div>
      <div className={styles.container__buttonBox}>
        <Button
          variant={"outline"}
          onClick={onCreate}
          className="w-full text-emerald-500 border-emerald-400 hover:bg-emerald-50 hover:text-emerald-600"
        >
          Add New Page
        </Button>
      </div>
      <div className={styles.container__todos}>
        <span className={styles.container__todos_label}>Your To do</span>
        <div className={styles.container__todos__list}>
          {todos &&
            todos.map((item) => {
              return (
                <div
                  key={item.id}
                  className="flex items-center py-2 bg-[#f4f4f4] rounded-sm cursor-pointer"
                >
                  <Dot className="mr-1 text-green-400"></Dot>
                  <span className="text-sm">
                    {item.title === "" ? "제목없음" : item.title}
                  </span>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default SideNavigation;
