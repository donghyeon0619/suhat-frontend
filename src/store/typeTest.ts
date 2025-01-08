import {defineStore} from "pinia";
import {get} from "@/api/httpService";

export interface TestOption {
  id: number;
  content: string;
  score: number;
}

export interface TestQuestion {
  id: number;
  content: string;
  testOptions: TestOption[];
}

interface TypeTestState {
  questionData: Record<number, TestQuestion[]>; // 각 serviceTypeId에 대한 질문 데이터 저장
  currentServiceTypeId: number
  currentServiceTypeName: string  // 현재 진행중인 serviceTypeName
}

export const useTypeTestStore = defineStore('typeTest',{
  state: (): TypeTestState => ({
    questionData: {},
    currentServiceTypeId: 0,
    currentServiceTypeName: "",
  }),
  actions: {
    async fetchQuestions(serviceTypeId: number): Promise<TestQuestion[]> {
      // 이미 데이터가 저장되어 있는 경우 반환
      if (this.questionData[serviceTypeId]) {
        return this.questionData[serviceTypeId];
      }
      try {
        // API 요청으로 데이터 가져오기
        const response: TestQuestion[] = await get(`test-questions/service-type/${serviceTypeId}`);

        // 데이터 매핑
        const mappedQuestions = response.map((question) => ({
          id: question.id,
          content: question.content,
          testOptions: question.testOptions.map((option) => ({
            id: option.id,
            content: option.content,
            score: option.score,
          })),
        }));

        // 매핑된 데이터를 저장
        this.questionData[serviceTypeId] = mappedQuestions;

        return mappedQuestions;
      } catch (error) {
        console.error('유형검사 조회 중 오류 발생', error);
        throw error;
      }
    },
    setCurrentServiceType(serviceTypeId: number, serviceTypeName: string){
      this.currentServiceTypeId = serviceTypeId;
      this.currentServiceTypeName = serviceTypeName;
    }
  }
})