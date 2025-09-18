import os
from typing import Any

from dotenv import load_dotenv
from fastmcp import Client
from litellm import acompletion

from pyagenity.checkpointer import InMemoryCheckpointer
from pyagenity.graph import StateGraph, ToolNode
from pyagenity.state.agent_state import AgentState
from pyagenity.utils import Message
from pyagenity.utils.constants import END
from pyagenity.utils.converter import convert_messages
from utils import pretty_print_messages

import logging

def list_all_loggers():
    for name in logging.Logger.manager.loggerDict.keys():
        print(name)

list_all_loggers()
