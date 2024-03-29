﻿using CuestionariosEntidades.DataTranferObjects;
using CuestionariosEntidades.Models;
using CuestionariosRN.BusinessObjects;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace CuestionariosAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuestionnaireController : ControllerBase
    {
        private readonly QuestionnaireRN questionnaireRN;

        public QuestionnaireController()
        {
            questionnaireRN = new QuestionnaireRN();
        }

        // Peticion tipo GET: api/GetQuestionnaires
        [HttpGet]
        [Route("GetQuestionnaires")]
        public async Task<ActionResult<ResponseDTO<List<Questionnaire>>>> GetQuestionnaires()
        {
            return await questionnaireRN.GetQuestionnaires();
        }

        [HttpGet]
        [Route("GetQuestionnaireReviewers")]
        public async Task<ActionResult<ResponseDTO<List<ReviewerQuestionnaire>>>> GetQuestionnaireReviewers(int questionnaireId)
        {
            return await questionnaireRN.GetQuestionnaireReviewers(questionnaireId);
        }

        // Peticion tipo GET: api/GetQuestionnairesToReview
        [HttpGet]
        [Route("GetQuestionnairesToReview")]
        public async Task<ActionResult<ResponseDTO<List<Questionnaire>>>> GetQuestionnairesToReview(int userId)
        {
            return await questionnaireRN.GetQuestionnairesToReview(userId);
        }

        // Peticion tipo GET: api/GetQuestionnaireById
        [HttpGet]
        [Route("GetQuestionnaireById")]
        public async Task<ActionResult<ResponseDTO<Questionnaire>>> GetQuestionnaireById(int questionnaireId)
        {
            return await questionnaireRN.GetQuestionnaireById(questionnaireId);
        }

        [HttpGet]
        [Route("SearchQuestionnaires")]
        public async Task<ActionResult<ResponseDTO<List<Questionnaire>>>> SearchQuestionnaires(string name)
        {
            return await questionnaireRN.SearchQuestionnaires(name);
        }

        // Petición tipo POST: api/CreateQuestionnaire
        [HttpPost]
        [Route("CreateQuestionnaire")]
        public async Task<ActionResult<ResponseDTO<int>>> CreateQuestionnaire(Questionnaire questionnaire)
        {
            return await questionnaireRN.CreateQuestionnaire(questionnaire);
        }

        //Petición tipo PUT: api/UpdateQuestionnaire
        [Route("UpdateQuestionnaire")]
        [HttpPut]
        public async Task<ActionResult<MessageDTO>> UpdateQuestionnaire(Questionnaire questionnaire)
        {
            return await questionnaireRN.UpdateQuestionnaire(questionnaire);
        }

        //Petición tipo DELETE: api/DeleteQuestionnaire
        [HttpDelete("DeleteQuestionnaire/{id}")]
        public async Task<ActionResult<MessageDTO>> DeleteQuestionnaire(int id)
        {
            return await questionnaireRN.DeleteQuestionnaire(id);
        }

        [HttpPost]
        [Route("CommitQuestionnaireAnswers")]
        public async Task<ActionResult<MessageDTO>> CommitQuestionnaireAnswers(Questionnaire questionnaire)
        {
            return await questionnaireRN.CommitQuestionnaireAnswers(questionnaire);
        }

        [HttpGet]
        [Route("GetQuestionnaireTypes")]
        public async Task<ActionResult<ResponseDTO<List<QuestionnaireType>>>> GetQuestionnaireTypes()
        {
            return await questionnaireRN.GetQuestionnaireTypes();
        }

    }
}
