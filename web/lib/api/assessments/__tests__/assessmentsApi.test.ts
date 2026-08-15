import { describe, it, expect, vi, beforeEach } from "vitest";
import { httpClient } from "@/lib/api/client";
import {
  startAssessment,
  answerQuestion,
  submitAssessment,
  cancelAssessment,
  getAssessmentResult,
  getAssessmentHistory,
} from "@/lib/api/assessments";
import type { AssessmentDifficulty } from "@/lib/types/assessment";

vi.mock("@/lib/api/client", () => ({
  httpClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("Assessments API index exports", () => {
  it("should export all assessment functions", () => {
    expect(typeof startAssessment).toBe("function");
    expect(typeof answerQuestion).toBe("function");
    expect(typeof submitAssessment).toBe("function");
    expect(typeof cancelAssessment).toBe("function");
    expect(typeof getAssessmentResult).toBe("function");
    expect(typeof getAssessmentHistory).toBe("function");
  });
});

describe("Assessments API (lib/api/assessments)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("startAssessment", () => {
    it("should start assessment without difficulty", async () => {
      const mockResponse = {
        id: "assessment-1",
        technologyResponse: { name: "JavaScript" },
        questions: [],
      };

      vi.mocked(httpClient.post).mockResolvedValueOnce({
        success: true,
        result: mockResponse,
      });

      const result = await startAssessment("JavaScript");
      expect(httpClient.post).toHaveBeenCalledWith(
        "/assessments/start/JavaScript",
      );
      expect(result).toEqual(mockResponse);
    });

    it("should start assessment with difficulty parameter", async () => {
      const mockResponse = {
        id: "assessment-1",
        technologyResponse: { name: "JavaScript" },
        questions: [],
      };

      vi.mocked(httpClient.post).mockResolvedValueOnce({
        success: true,
        result: mockResponse,
      });

      const result = await startAssessment(
        "JavaScript",
        "BEGINNER" as AssessmentDifficulty,
      );
      expect(httpClient.post).toHaveBeenCalledWith(
        "/assessments/start/JavaScript?difficulty=BEGINNER",
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("answerQuestion", () => {
    it("should submit answer for a question", async () => {
      vi.mocked(httpClient.put).mockResolvedValueOnce(undefined);

      await answerQuestion("assessment-1", 1, 2);
      expect(httpClient.put).toHaveBeenCalledWith(
        "/assessments/assessment-1/answers/1",
        {
          questionId: 1,
          selectedOptionId: 2,
        },
      );
    });
  });

  describe("submitAssessment", () => {
    it("should submit assessment for grading", async () => {
      const mockResponse = {
        assessmentId: "assessment-1",
        status: "COMPLETED",
      };

      vi.mocked(httpClient.post).mockResolvedValueOnce({
        success: true,
        result: mockResponse,
      });

      const result = await submitAssessment("assessment-1");
      expect(httpClient.post).toHaveBeenCalledWith(
        "/assessments/assessment-1/submit",
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("cancelAssessment", () => {
    it("should cancel an assessment", async () => {
      vi.mocked(httpClient.post).mockResolvedValueOnce(undefined);

      await cancelAssessment("assessment-1");
      expect(httpClient.post).toHaveBeenCalledWith(
        "/assessments/assessment-1/cancel",
      );
    });
  });

  describe("getAssessmentResult", () => {
    it("should fetch assessment result", async () => {
      const mockResponse = {
        assessmentId: "assessment-1",
        correctAnswers: 8,
        totalQuestions: 10,
      };

      vi.mocked(httpClient.get).mockResolvedValueOnce({
        success: true,
        result: mockResponse,
      });

      const result = await getAssessmentResult("assessment-1");
      expect(httpClient.get).toHaveBeenCalledWith(
        "/assessments/assessment-1/result",
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("getAssessmentHistory", () => {
    it("should fetch assessment history without filters", async () => {
      const mockResponse = {
        assessments: [],
        total: 0,
      };

      vi.mocked(httpClient.get).mockResolvedValueOnce({
        success: true,
        result: mockResponse,
      });

      const result = await getAssessmentHistory();
      expect(httpClient.get).toHaveBeenCalledWith("/assessments/history");
      expect(result).toEqual(mockResponse);
    });

    it("should fetch assessment history with technology filter", async () => {
      const mockResponse = {
        assessments: [],
        total: 0,
      };

      vi.mocked(httpClient.get).mockResolvedValueOnce({
        success: true,
        result: mockResponse,
      });

      const result = await getAssessmentHistory({ technology: "JavaScript" });
      expect(httpClient.get).toHaveBeenCalledWith(
        "/assessments/history?technology=JavaScript",
      );
      expect(result).toEqual(mockResponse);
    });

    it("should fetch assessment history with status filter", async () => {
      const mockResponse = {
        assessments: [],
        total: 0,
      };

      vi.mocked(httpClient.get).mockResolvedValueOnce({
        success: true,
        result: mockResponse,
      });

      const result = await getAssessmentHistory({ status: "COMPLETED" });
      expect(httpClient.get).toHaveBeenCalledWith(
        "/assessments/history?status=COMPLETED",
      );
      expect(result).toEqual(mockResponse);
    });

    it("should fetch assessment history with both filters", async () => {
      const mockResponse = {
        assessments: [],
        total: 0,
      };

      vi.mocked(httpClient.get).mockResolvedValueOnce({
        success: true,
        result: mockResponse,
      });

      const result = await getAssessmentHistory({
        technology: "JavaScript",
        status: "COMPLETED",
      });
      expect(httpClient.get).toHaveBeenCalledWith(
        "/assessments/history?technology=JavaScript&status=COMPLETED",
      );
      expect(result).toEqual(mockResponse);
    });
  });
});

vi.mock("@/lib/api/client", () => ({
  httpClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("Assessments API (lib/api/assessments)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("startAssessment", () => {
    it("should start assessment without difficulty", async () => {
      const mockResponse = {
        id: "assessment-1",
        technologyResponse: { name: "JavaScript" },
        questions: [],
      };

      vi.mocked(httpClient.post).mockResolvedValueOnce({
        success: true,
        result: mockResponse,
      });

      const result = await startAssessment("JavaScript");
      expect(httpClient.post).toHaveBeenCalledWith(
        "/assessments/start/JavaScript",
      );
      expect(result).toEqual(mockResponse);
    });

    it("should start assessment with difficulty parameter", async () => {
      const mockResponse = {
        id: "assessment-1",
        technologyResponse: { name: "JavaScript" },
        questions: [],
      };

      vi.mocked(httpClient.post).mockResolvedValueOnce({
        success: true,
        result: mockResponse,
      });

      const result = await startAssessment(
        "JavaScript",
        "BEGINNER" as AssessmentDifficulty,
      );
      expect(httpClient.post).toHaveBeenCalledWith(
        "/assessments/start/JavaScript?difficulty=BEGINNER",
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("answerQuestion", () => {
    it("should submit answer for a question", async () => {
      vi.mocked(httpClient.put).mockResolvedValueOnce(undefined);

      await answerQuestion("assessment-1", 1, 2);
      expect(httpClient.put).toHaveBeenCalledWith(
        "/assessments/assessment-1/answers/1",
        {
          questionId: 1,
          selectedOptionId: 2,
        },
      );
    });
  });

  describe("submitAssessment", () => {
    it("should submit assessment for grading", async () => {
      const mockResponse = {
        assessmentId: "assessment-1",
        status: "COMPLETED",
      };

      vi.mocked(httpClient.post).mockResolvedValueOnce({
        success: true,
        result: mockResponse,
      });

      const result = await submitAssessment("assessment-1");
      expect(httpClient.post).toHaveBeenCalledWith(
        "/assessments/assessment-1/submit",
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("cancelAssessment", () => {
    it("should cancel an assessment", async () => {
      vi.mocked(httpClient.post).mockResolvedValueOnce(undefined);

      await cancelAssessment("assessment-1");
      expect(httpClient.post).toHaveBeenCalledWith(
        "/assessments/assessment-1/cancel",
      );
    });
  });

  describe("getAssessmentResult", () => {
    it("should fetch assessment result", async () => {
      const mockResponse = {
        assessmentId: "assessment-1",
        correctAnswers: 8,
        totalQuestions: 10,
      };

      vi.mocked(httpClient.get).mockResolvedValueOnce({
        success: true,
        result: mockResponse,
      });

      const result = await getAssessmentResult("assessment-1");
      expect(httpClient.get).toHaveBeenCalledWith(
        "/assessments/assessment-1/result",
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("getAssessmentHistory", () => {
    it("should fetch assessment history without filters", async () => {
      const mockResponse = {
        assessments: [],
        total: 0,
      };

      vi.mocked(httpClient.get).mockResolvedValueOnce({
        success: true,
        result: mockResponse,
      });

      const result = await getAssessmentHistory();
      expect(httpClient.get).toHaveBeenCalledWith("/assessments/history");
      expect(result).toEqual(mockResponse);
    });

    it("should fetch assessment history with technology filter", async () => {
      const mockResponse = {
        assessments: [],
        total: 0,
      };

      vi.mocked(httpClient.get).mockResolvedValueOnce({
        success: true,
        result: mockResponse,
      });

      const result = await getAssessmentHistory({ technology: "JavaScript" });
      expect(httpClient.get).toHaveBeenCalledWith(
        "/assessments/history?technology=JavaScript",
      );
      expect(result).toEqual(mockResponse);
    });

    it("should fetch assessment history with status filter", async () => {
      const mockResponse = {
        assessments: [],
        total: 0,
      };

      vi.mocked(httpClient.get).mockResolvedValueOnce({
        success: true,
        result: mockResponse,
      });

      const result = await getAssessmentHistory({ status: "COMPLETED" });
      expect(httpClient.get).toHaveBeenCalledWith(
        "/assessments/history?status=COMPLETED",
      );
      expect(result).toEqual(mockResponse);
    });

    it("should fetch assessment history with both filters", async () => {
      const mockResponse = {
        assessments: [],
        total: 0,
      };

      vi.mocked(httpClient.get).mockResolvedValueOnce({
        success: true,
        result: mockResponse,
      });

      const result = await getAssessmentHistory({
        technology: "JavaScript",
        status: "COMPLETED",
      });
      expect(httpClient.get).toHaveBeenCalledWith(
        "/assessments/history?technology=JavaScript&status=COMPLETED",
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
