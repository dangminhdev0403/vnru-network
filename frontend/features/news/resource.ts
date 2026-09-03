import {
  createResource,
  defineMutation,
  defineQuery,
} from "@dangminhdev04032005/query-resource";
import { newsRepository } from "./repository";
import type {
  NewsArticle,
  NewsInput,
  AdminNewsListFilters,
} from "./repository";

export const newsResource = createResource<void>()({
  namespace: ["vnru"],
  name: "admin-news",
  scopeKey: () => ["current-context"],
  queries: {
    list: defineQuery({
      inputKey: (filters?: AdminNewsListFilters) => [
        filters?.locale ?? "RU",
        filters?.contentType ?? "ALL",

        filters?.category ?? "ALL",
        filters?.query ?? "",
        filters?.featured ?? "ALL",
        filters?.published ?? "ALL",
        filters?.limit ?? 10,
        filters?.offset ?? 0,
      ],
      queryFn: ({ input, signal }) => newsRepository.list(input, signal),
    }),
    detail: defineQuery({
      inputKey: (id: string) => [id],
      queryFn: ({ input, signal }) => newsRepository.detail(input, signal),
    }),
  },
  mutations: {
    create: defineMutation<void, NewsInput, NewsArticle>({
      mutationFn: ({ variables }) => newsRepository.create(variables),
    }),
    update: defineMutation<
      void,
      { id: string; input: Partial<NewsInput> },
      NewsArticle
    >({ mutationFn: ({ variables }) => newsRepository.update(variables) }),
    delete: defineMutation({
      mutationFn: ({ variables }: { variables: string }) =>
        newsRepository.delete(variables),
    }),
    upload: defineMutation({
      mutationFn: ({ variables }: { variables: File }) =>
        newsRepository.upload(variables),
    }),

  },
});
