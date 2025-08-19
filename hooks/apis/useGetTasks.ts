//Task 전체를 조회
"use client";

import { tasksAtom } from "@/store/atoms";
import { supabase } from "@/utils/supabase/client";
import { toast } from "sonner";
import { useAtom } from "jotai";

function useGetTasks() {
  const [tasks, setTasks] = useAtom(tasksAtom);
  const getTasks = async () => {
    try {
      const { data, status, error } = await supabase.from("todos").select("*");

      //성공적으로 반환된 경우
      if (data && status === 200) {
        setTasks(data);
      }
      if (error) {
        toast("에러 발생", {
          description: `Supabase 오류: ${error.message}`,
          className: "bg-red-500 text-white border-red-600",
        });
      }
    } catch (error) {
      console.log(error);
      toast("네트워크 오류", {
        description: `서버와 연결할 수 없습니다. 다시 시도해주세요
          ${error}`,
        className: "bg-red-500 text-white border-red-600",
      });
    }
  };
  return {getTasks, tasks};
}
export {useGetTasks};
