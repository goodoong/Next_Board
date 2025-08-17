"use client";

import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function useCreateTask() {
  const router = useRouter();
  const createTask = async () => {
    try {
      const { data, status, error } = await supabase
        .from("todos")
        .insert([
          {
            title: null,
            start_date: null,
            end_date: null,
            boards: [],
          },
        ])
        .select();
      console.log(data);
      if (data && status === 201) {
        //올바르게 todos 테이블에 row 생성
        toast("페이지 생성 완료", {
          description: "새로운 투두리스트가 생성되었습니다.",
        });
        router.push(`/task/${data[0].id}`);
      }
      if(error) {
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
  return createTask;
}
 export {useCreateTask};